import json
import datetime
import time
import os
import dateutil.parser
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

table = dynamodb_client.Table('HotelBookings')

def elicit_slot(session_attributes, intent_name, slots, slot_to_elicit, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitSlot',
            'intentName': intent_name,
            'slots': slots,
            'slotToElicit': slot_to_elicit,
            'message': message
        }
    }


def confirm_intent(session_attributes, intent_name, slots, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ConfirmIntent',
            'intentName': intent_name,
            'slots': slots,
            'message': message
        }
    }


def close(session_attributes, fulfillment_state, message):
    response = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }

    return response


def delegate(session_attributes, slots):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    }


def safe_int(n):
    if n is not None:
        return int(n)
    return n


def try_ex(func):
    try:
        return func()
    except KeyError:
        return None


def generate_hotel_price(location, nights, room_type):
    room_types = ['queen', 'king', 'deluxe']
    cost_of_living = 0
    for i in range(len(location)):
        cost_of_living += ord(location.lower()[i]) - 97

    return nights * (100 + cost_of_living + (100 + room_types.index(room_type.lower())))

def isvalid_city(city):
    valid_cities = ['new york', 'los angeles', 'chicago', 'houston', 'philadelphia', 'phoenix', 'san antonio', 'san diego', 'dallas', 
                    'san jose', 'austin', 'jacksonville', 'san francisco', 'indianapolis','columbus', 'fort worth', 'charlotte', 
                    'detroit', 'el paso', 'seattle', 'denver', 'washington dc', 'memphis', 'boston', 'nashville', 'baltimore', 'portland']
    
    return city.lower() in valid_cities


def isvalid_room_type(room_type):
    room_types = ['queen', 'king', 'deluxe']
    return room_type.lower() in room_types


def isvalid_date(date):
    try:
        dateutil.parser.parse(date)
        return True
    except ValueError:
        return False

def get_day_difference(later_date, earlier_date):
    later_datetime = dateutil.parser.parse(later_date).date()
    earlier_datetime = dateutil.parser.parse(earlier_date).date()
    return abs(later_datetime - earlier_datetime).days


def add_days(date, number_of_days):
    new_date = dateutil.parser.parse(date).date()
    new_date += datetime.timedelta(days=number_of_days)
    return new_date.strftime('%Y-%m-%d')


def build_validation_result(isvalid, violated_slot, message_content):
    return {
        'isValid': isvalid,
        'violatedSlot': violated_slot,
        'message': {'contentType': 'PlainText', 'content': message_content}
    }


def validate_hotel(slots):
    location = try_ex(lambda: slots['Location'])
    checkin_date = try_ex(lambda: slots['CheckInDate'])
    nights = safe_int(try_ex(lambda: slots['Nights']))
    room_type = try_ex(lambda: slots['RoomType'])

    if location and not isvalid_city(location):
        return build_validation_result(
            False,
            'Location',
            'We currently do not support {} as a valid destination.  Can you try a different city?'.format(location)
        )

    if checkin_date:
        if not isvalid_date(checkin_date):
            return build_validation_result(False, 'CheckInDate', 'I did not understand your check in date.  When would you like to check in?')
        if datetime.datetime.strptime(checkin_date, '%Y-%m-%d').date() <= datetime.date.today():
            return build_validation_result(False, 'CheckInDate', 'Reservations must be scheduled at least one day in advance.  Can you try a different date?')

    if nights is not None and (nights < 1 or nights > 30):
        return build_validation_result(
            False,
            'Nights',
            'You can make a reservations for from one to thirty nights.  How many long would you like to stay for?'
        )

    if room_type and not isvalid_room_type(room_type):
        return build_validation_result(False, 'RoomType', 'I did not recognize that room type.  Would you like to stay in a queen, king, or deluxe room?')

    return {'isValid': True}


def book_hotel(intent_request):

    location = try_ex(lambda: intent_request['currentIntent']['slots']['Location'])
    checkin_date = try_ex(lambda: intent_request['currentIntent']['slots']['CheckInDate'])
    nights = safe_int(try_ex(lambda: intent_request['currentIntent']['slots']['Nights']))

    room_type = try_ex(lambda: intent_request['currentIntent']['slots']['RoomType'])
    session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}

    reservation = json.dumps({
        'ReservationType': 'Hotel',
        'Location': location,
        'RoomType': room_type,
        'CheckInDate': checkin_date,
        'Nights': nights
    })
    
    dbresponse = table.put_item(reservation)
    print(dbresponse)

    session_attributes['currentReservation'] = reservation

    if intent_request['invocationSource'] == 'DialogCodeHook':
        validation_result = validate_hotel(intent_request['currentIntent']['slots'])
        if not validation_result['isValid']:
            slots = intent_request['currentIntent']['slots']
            slots[validation_result['violatedSlot']] = None

            return elicit_slot(
                session_attributes,
                intent_request['currentIntent']['name'],
                slots,
                validation_result['violatedSlot'],
                validation_result['message']
            )

        if location and checkin_date and nights and room_type:
            price = generate_hotel_price(location, nights, room_type)
            session_attributes['currentReservationPrice'] = price
        else:
            try_ex(lambda: session_attributes.pop('currentReservationPrice'))

        session_attributes['currentReservation'] = reservation
        return delegate(session_attributes, intent_request['currentIntent']['slots'])

    logger.debug('bookHotel under={}'.format(reservation))

    try_ex(lambda: session_attributes.pop('currentReservationPrice'))
    try_ex(lambda: session_attributes.pop('currentReservation'))
    session_attributes['lastConfirmedReservation'] = reservation

    return close(
        session_attributes,
        'Fulfilled',
        {
            'contentType': 'PlainText',
            'content': 'Thanks, I have placed your reservation. Have a great day.'
        }
    )


def dispatch(intent_request):

    logger.debug('dispatch userId={}, intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))

    intent_name = intent_request['currentIntent']['name']

    # Dispatch to your bot's intent handlers
    if intent_name == 'BookHotel_chatbot':
        return book_hotel(intent_request)

    raise Exception('Intent with name ' + intent_name + ' not supported')


def lambda_handler(event, context):
   dynamodb_client = boto3.resource('dynamodb')
    os.environ['TZ'] = 'America/New_York'
    time.tzset()
    logger.debug('event.bot.name={}'.format(event['bot']['name']))

    return dispatch(event)

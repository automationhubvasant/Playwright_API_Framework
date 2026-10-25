export const bookingSchema = {
  type: 'object',
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  additionalProperties: false,
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: {
      type: 'object',
      required: ['checkin', 'checkout'],
      additionalProperties: false,
      properties: {
        checkin: { type: 'string', format: 'date' },
        checkout: { type: 'string', format: 'date' },
      },
    },
    additionalneeds: { type: 'string' },
  },
};

export const createBookingResponseSchema = {
  type: 'object',
  required: ['bookingid', 'booking'],
  additionalProperties: false,
  properties: {
    bookingid: { type: 'integer' },
    booking: bookingSchema,
  },
};

export const updateBookingResponseSchema = bookingSchema;

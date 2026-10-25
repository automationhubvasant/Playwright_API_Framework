import { Endpoints } from './endpoints.js';

export class BookingApi {
  constructor(request) {
    this.request = request;
  }

  createBooking(payload) {
    return this.request.post(Endpoints.booking, { data: payload });
    // return this.request.post("https://restful-booker.herokuapp.com/booking", { data: payload });
  }

  getBooking(id) {
    return this.request.get(Endpoints.bookingById(id));
  }

  updateBooking(id, payload, token) {
    return this.request.put(Endpoints.bookingById(id), {
      data: payload,
      headers: { Cookie: `token=${token}` },
    });
  }

  deleteBooking(id, token) {
    return this.request.delete(Endpoints.bookingById(id), {
      headers: { Cookie: `token=${token}` },
    });
  }
}

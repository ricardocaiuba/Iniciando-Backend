import AppError from "@shared/errors/AppError";

import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import ListProviderDayAvailabilityService from "@modules/appointments/services/ListProviderDayAvailabilityService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe("ListProviderDayAvailability", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to list the day availability from provider", async () => {
    await fakeAppointmentsRepository.create({
      provider_id: "user_id",
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: "user_id",
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      const custonDate = new Date(2020, 4, 20, 11);
      return custonDate.getTime();
    });

    const availabily = await listProviderDayAvailability.execute({
      provider_id: "user_id",
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availabily).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ])
    );
  });
});

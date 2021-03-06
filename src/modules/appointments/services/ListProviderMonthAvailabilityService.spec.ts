import AppError from "@shared/errors/AppError";

import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import ListProviderMonthAvailabilityService from "@modules/appointments/services/ListProviderMonthAvailabilityService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe("ListProviderMonthAvailability", () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it("should be able to list the month availability from provider", async () => {
    await fakeAppointmentsRepository.create({
      provider_id: "user_id",
      date: new Date(2020, 3, 20, 8, 0, 0),
    });

    for (let i = 8; i <= 17; i++) {
      await fakeAppointmentsRepository.create({
        provider_id: "user_id",
        date: new Date(2020, 4, 20, i, 0, 0),
      });
    }

    await fakeAppointmentsRepository.create({
      provider_id: "user_id",
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availabily = await listProviderMonthAvailability.execute({
      provider_id: "user_id",
      year: 2020,
      month: 5,
    });

    expect(availabily).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ])
    );
  });
});

import { injectable, inject } from "tsyringe";
import { getHours } from "date-fns";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type TResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute(data: IRequest): Promise<TResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      data
    );

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart
    );

    const availability = eachHourArray.map((hour) => {
      const hasAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour
      );
      return {
        hour,
        available: !hasAppointmentInHour,
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;

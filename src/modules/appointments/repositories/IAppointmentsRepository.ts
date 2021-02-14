import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";
import ICreateAppointmentDTO from "../dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;

  findByDate(data: Date): Promise<Appointment | undefined>;

  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO
  ): Promise<Appointment[]>;

  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO
  ): Promise<Appointment[]>;
}

export default IAppointmentsRepository;

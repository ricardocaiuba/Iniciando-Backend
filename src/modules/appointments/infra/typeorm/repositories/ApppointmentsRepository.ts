import { getRepository, Repository, Raw } from "typeorm";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(data: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { data },
    });
    return findAppointment || undefined;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parseMonth = String(month).padStart(2, "0");

    const appontments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, "MM-YYYY") = "${parseMonth}-${year}"`
        ),
      },
    });

    return appontments;
  }

  public async findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO
  ): Promise<Appointment[]> {
    const parseMonth = String(data.month).padStart(2, "0");
    const parseDay = String(data.day).padStart(2, "0");

    const appontments = await this.ormRepository.find({
      where: {
        provider_id: data.provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, "DD-MM-YYYY") = "${parseDay}-${parseMonth}-${data.year}"`
        ),
      },
    });

    return appontments;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}
export default AppointmentsRepository;

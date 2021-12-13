using System.Linq;
using AutoMapper;
using BlueWaterCruises.Infrastructure.Extensions;

namespace BlueWaterCruises.Features.Manifest {

    public class ManifestMappingProfile : Profile {

        public ManifestMappingProfile() {
            CreateMap<ManifestViewModel, ManifestResource>()
                .ForMember(dest => dest.Date, x => x.MapFrom(source => source.Date))
                .ForMember(dest => dest.Ship, x => x.MapFrom(source => new ShipResource {
                    Description = source.Ship.Description,
                    IMO = source.Ship.IMO,
                    Flag = source.Ship.Flag,
                    RegistryNo = source.Ship.RegistryNo,
                    Manager = source.Ship.Manager,
                    ManagerInGreece = source.Ship.ManagerInGreece,
                    Agent = source.Ship.Agent,
                    ShipOwner = new ShipOwnerResource {
                        Description = source.Ship.ShipOwner.Description,
                        Profession = source.Ship.ShipOwner.Profession,
                        Address = source.Ship.ShipOwner.Address,
                        City = source.Ship.ShipOwner.City,
                        TaxNo = source.Ship.ShipOwner.TaxNo
                    },
                    Registrars = source.Ship.Registrars.ConvertAll(registrar => new RegistrarResource {
                        Fullname = registrar.Fullname,
                        Phones = registrar.Phones,
                        Email = registrar.Email,
                        Fax = registrar.Fax,
                        Address = registrar.Address,
                        IsPrimary = registrar.IsPrimary,
                        IsActive = registrar.IsActive
                    }),
                    Crew = source.Ship.Crew.ConvertAll(crew => new ManifestCrewResource {
                        Id = crew.Id,
                        Lastname = crew.Lastname,
                        Firstname = crew.Firstname,
                        Birthdate = crew.Birthdate,
                        IsActive = crew.IsActive,
                        OccupantDescription = "Crew",
                    }),
                }))
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(passenger => new PassengerResource {
                    Id = passenger.Id,
                    ReservationId = passenger.ReservationId,
                    Lastname = passenger.Lastname,
                    Firstname = passenger.Firstname,
                    Birthdate = DateConversions.DateTimeToISOString(passenger.Birthdate),
                    Remarks = passenger.Remarks,
                    SpecialCare = passenger.SpecialCare,
                    IsCheckedIn = passenger.IsCheckedIn,
                    NationalityCode = passenger.Nationality.Code,
                    NationalityDescription = passenger.Nationality.Description,
                    GenderDescription = passenger.Gender.Description,
                    OccupantDescription = "Passenger"
                })));
        }

    }

}
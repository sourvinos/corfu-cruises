using System.Linq;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Manifest {

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
                        IsPrimary = registrar.IsPrimary
                    }),
                    Crew = source.Ship.Crews.ConvertAll(crew => new ManifestCrewResource {
                        Lastname = crew.Lastname,
                        Firstname = crew.Firstname,
                        Birthdate = DateHelpers.DateTimeToISOString(crew.Birthdate),
                        OccupantDescription = crew.Occupant.Description,
                        GenderDescription = crew.Gender.Description,
                        NationalityDescription = crew.Nationality.Description,
                    }),
                }))
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(passenger => new PassengerResource {
                    ReservationId = passenger.ReservationId,
                    Lastname = passenger.Lastname,
                    Firstname = passenger.Firstname,
                    Birthdate = DateHelpers.DateTimeToISOString(passenger.Birthdate),
                    Remarks = passenger.Remarks,
                    SpecialCare = passenger.SpecialCare,
                    IsCheckedIn = passenger.IsCheckedIn,
                    NationalityCode = passenger.Nationality.Code,
                    NationalityDescription = passenger.Nationality.Description,
                    GenderDescription = passenger.Gender.Description,
                    OccupantDescription = passenger.Occupant.Description
                })));
        }

    }

}
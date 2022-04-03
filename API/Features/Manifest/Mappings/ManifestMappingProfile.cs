using System.Linq;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Manifest {

    public class ManifestMappingProfile : Profile {

        public ManifestMappingProfile() {
            CreateMap<ManifestViewModel, ManifestResource>()
                .ForMember(x => x.Date, x => x.MapFrom(source => source.Date))
                .ForMember(x => x.Destination, x => x.MapFrom(source => source.Destination.Description))
                .ForMember(x => x.Port, x => x.MapFrom(source => source.Port.Description))
                .ForMember(x => x.Ship, x => x.MapFrom(source => new ManifestShipViewModel {
                    Description = source.Ship.Description,
                    IMO = source.Ship.IMO,
                    Flag = source.Ship.Flag,
                    RegistryNo = source.Ship.RegistryNo,
                    Manager = source.Ship.Manager,
                    ManagerInGreece = source.Ship.ManagerInGreece,
                    Agent = source.Ship.Agent,
                    ShipOwner = new ManifestShipOwnerViewModel {
                        Description = source.Ship.ShipOwner.Description,
                        Profession = source.Ship.ShipOwner.Profession,
                        Address = source.Ship.ShipOwner.Address,
                        City = source.Ship.ShipOwner.City,
                        Phones = source.Ship.ShipOwner.Phones,
                        TaxNo = source.Ship.ShipOwner.TaxNo
                    },
                    Registrars = source.Ship.Registrars
                        .ConvertAll(registrar => new ManifestRegistrarViewModel {
                            Fullname = registrar.Fullname,
                            Phones = registrar.Phones,
                            Email = registrar.Email,
                            Fax = registrar.Fax,
                            Address = registrar.Address,
                            IsPrimary = registrar.IsPrimary
                        })
                        .OrderBy(x => !x.IsPrimary)
                        .ToList(),
                    Crew = source.Ship.Crews
                        .ConvertAll(crew => new ManifestCrewViewModel {
                            Lastname = crew.Lastname,
                            Firstname = crew.Firstname,
                            Birthdate = DateHelpers.DateTimeToISOString(crew.Birthdate),
                            GenderDescription = crew.Gender.Description,
                            NationalityDescription = crew.Nationality.Description,
                            OccupantDescription = crew.Occupant.Description,
                        })
                        .OrderBy(x => x.Lastname).ThenBy(x => x.Firstname)
                        .ToList()
                }))
                .ForMember(x => x.ShipRoute, x => x.MapFrom(source => new ManifestShipRouteViewModel {
                    Description = source.ShipRoute.Description,
                    FromPort = source.ShipRoute.FromPort,
                    FromTime = source.ShipRoute.FromTime,
                    ViaPort = source.ShipRoute.ViaPort,
                    ViaTime = source.ShipRoute.ViaTime,
                    ToPort = source.ShipRoute.ToPort,
                    ToTime = source.ShipRoute.ToTime
                }))
                .ForMember(x => x.Passengers, x => x.MapFrom(source => source.Passengers.Select(passenger => new ManifestPassengerViewModel {
                    Lastname = passenger.Lastname,
                    Firstname = passenger.Firstname,
                    Birthdate = DateHelpers.DateTimeToISOString(passenger.Birthdate),
                    Remarks = passenger.Remarks,
                    SpecialCare = passenger.SpecialCare,
                    NationalityCode = passenger.Nationality.Code,
                    GenderDescription = passenger.Gender.Description,
                    NationalityDescription = passenger.Nationality.Description,
                    OccupantDescription = passenger.Occupant.Description
                }).OrderBy(x => x.Lastname).ThenBy(x => x.Firstname).ThenBy(x => x.Birthdate)));
        }

    }

}
using System.Linq;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Manifest {

    public class ManifestMappingProfile : Profile {

        public ManifestMappingProfile() {
            CreateMap<ManifestInitialVM, ManifestFinalVM>()
                .ForMember(x => x.Date, x => x.MapFrom(source => source.Date))
                .ForMember(x => x.Destination, x => x.MapFrom(source => source.Destination.Description))
                .ForMember(x => x.Ship, x => x.MapFrom(source => new ManifestFinalShipVM {
                    Description = source.Ship.Description,
                    IMO = source.Ship.IMO,
                    Flag = source.Ship.Flag,
                    RegistryNo = source.Ship.RegistryNo,
                    Manager = source.Ship.Manager,
                    ManagerInGreece = source.Ship.ManagerInGreece,
                    Agent = source.Ship.Agent,
                    ShipOwner = new ManifestFinalShipOwnerVM {
                        Description = source.Ship.ShipOwner.Description,
                        Profession = source.Ship.ShipOwner.Profession,
                        Address = source.Ship.ShipOwner.Address,
                        City = source.Ship.ShipOwner.City,
                        Phones = source.Ship.ShipOwner.Phones,
                        TaxNo = source.Ship.ShipOwner.TaxNo
                    },
                    Registrars = source.Ship.Registrars
                        .ConvertAll(registrar => new ManifestFinalRegistrarVM {
                            Fullname = registrar.Fullname,
                            Phones = registrar.Phones,
                            Email = registrar.Email,
                            Fax = registrar.Fax,
                            Address = registrar.Address,
                            IsPrimary = registrar.IsPrimary
                        })
                        .OrderBy(x => !x.IsPrimary)
                        .ToList(),
                    Crew = source.Ship.ShipCrews
                        .ConvertAll(crew => new ManifestFinalCrewVM {
                            Lastname = crew.Lastname.ToUpper(),
                            Firstname = crew.Firstname.ToUpper(),
                            Birthdate = DateHelpers.DateToISOString(crew.Birthdate),
                            GenderDescription = crew.Gender.Description,
                            NationalityCode = crew.Nationality.Code,
                            NationalityDescription = crew.Nationality.Description,
                            OccupantDescription = crew.Occupant.Description,
                        })
                        .OrderBy(x => x.Lastname).ThenBy(x => x.Firstname)
                        .ToList()
                }))
                .ForMember(x => x.ShipRoute, x => x.MapFrom(source => new ManifestFinalShipRouteVM {
                    Description = source.ShipRoute.Description,
                    FromPort = source.ShipRoute.FromPort,
                    FromTime = source.ShipRoute.FromTime,
                    ViaPort = source.ShipRoute.ViaPort,
                    ViaTime = source.ShipRoute.ViaTime,
                    ToPort = source.ShipRoute.ToPort,
                    ToTime = source.ShipRoute.ToTime
                }))
                .ForMember(x => x.Passengers, x => x.MapFrom(source => source.Passengers.Select(passenger => new ManifestFinalPassengerVM {
                    Lastname = passenger.Lastname.ToUpper(),
                    Firstname = passenger.Firstname.ToUpper(),
                    Birthdate = DateHelpers.DateToISOString(passenger.Birthdate),
                    Remarks = passenger.Remarks,
                    SpecialCare = passenger.SpecialCare,
                    GenderDescription = passenger.Gender.Description,
                    NationalityCode = passenger.Nationality.Code,
                    NationalityDescription = passenger.Nationality.Description,
                    OccupantDescription = passenger.Occupant.Description

                }).OrderBy(x => x.Lastname).ThenBy(x => x.Firstname).ThenBy(x => x.Birthdate)));
        }

    }

}
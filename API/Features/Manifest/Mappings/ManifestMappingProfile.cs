using System.Linq;
using API.Features.Ports;
using API.Features.Reservations;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Manifest {

    public class ManifestMappingProfile : Profile {

        // public ManifestMappingProfile() {
        //     CreateMap<Reservation, ManifestVM>()
        //         .ForMember(x => x.Date, x => x.MapFrom(source => DateHelpers.DateToISOString(source.Date)))
        //         .ForMember(x => x.Destination, x => x.MapFrom(source => source.Destination.Description))
        //         .ForMember(x => x.Port, x => x.MapFrom(source => source.Port.Description))
        //         .ForMember(x => x.Passengers, x => x.MapFrom(source => source.Passengers.Select(passenger => new ManifestFinalPassengerVM {
        //             Lastname = passenger.Lastname,
        //             Firstname = passenger.Firstname,
        //             Birthdate = DateHelpers.DateToISOString(passenger.Birthdate),
        //             Remarks = passenger.Remarks,
        //             SpecialCare = passenger.SpecialCare,
        //             NationalityCode = passenger.Nationality.Code,
        //             GenderDescription = passenger.Gender.Description,
        //             OccupantDescription = passenger.Occupant.Description
        //         }).OrderBy(x => x.Lastname).ThenBy(x => x.Firstname).ThenBy(x => x.Birthdate)));
        // }

    }

}
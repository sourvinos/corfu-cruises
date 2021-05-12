using System.Linq;
using AutoMapper;

namespace CorfuCruises {

    public class ManifestMappingProfile : Profile {

        public ManifestMappingProfile() {
            CreateMap<What, ManifestResource>()
                .ForMember(x => x.Passengers, x => x.MapFrom(x => x.Passengers.Select(passenger => new PassengerViewModel {
                    Lastname = passenger.Lastname,
                    Firstname = passenger.Firstname,
                    Gender = passenger.Gender.Description,
                    Nationality = passenger.Nationality.Description,
                    DoB = passenger.DoB,
                    Occupant = passenger.Occupant.Description,
                    SpecialCare = passenger.SpecialCare,
                    Remarks = passenger.Remarks
                })));
        }

    }

}
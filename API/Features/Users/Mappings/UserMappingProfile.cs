using System;
using AutoMapper;

namespace API.Features.Users {

    public class UserMappingProfile : Profile {

        public UserMappingProfile() {
            CreateMap<UserNewDto, UserExtended>()
                .ForMember(x => x.EmailConfirmed, x => x.MapFrom(x => true))
                .ForMember(x => x.SecurityStamp, x => x.MapFrom(x => Guid.NewGuid().ToString()));
            CreateMap<UserExtended, UserReadDto>();
        }

    }

}
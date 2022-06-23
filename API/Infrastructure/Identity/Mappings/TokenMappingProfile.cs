using System;
using API.Infrastructure.Auth;
using AutoMapper;

namespace API.Infrastructure.Identity {

    public class TokenMappingProfile : Profile {

        public TokenMappingProfile() {
            CreateMap<Token, TokenVM>()
                .ForMember(x => x.ExpiryDate, x => x.MapFrom(x => x.CreatedDate.AddHours(1)))
                .ForMember(x => x.Now, x => x.MapFrom(x => DateTime.UtcNow))
                .ForMember(x => x.Duration, x => x.MapFrom(x => (DateTime.UtcNow - x.CreatedDate).TotalHours))
                .ForMember(x => x.IsLoggedIn, x => x.MapFrom<DurationResolver>());
        }

    }

    public class DurationResolver : IValueResolver<Token, TokenVM, bool> {

        public bool Resolve(Token source, TokenVM destination, bool destMember, ResolutionContext context) {
            var duration = DateTime.UtcNow.Subtract(source.CreatedDate).TotalHours;
            return duration <= 1;
        }

    }

}
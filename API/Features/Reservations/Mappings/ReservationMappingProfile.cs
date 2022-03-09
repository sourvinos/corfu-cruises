using System.Linq;
using API.Features.Drivers;
using API.Features.Ships;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Reservations {

    public class ReservationMappingProfile : Profile {

        public ReservationMappingProfile() {
            // List
            CreateMap<Reservation, ReservationListResource>()
                .ForMember(x => x.RouteAbbreviation, x => x.MapFrom(x => x.PickupPoint.Route.Abbreviation))
                .ForMember(x => x.DriverDescription, x => x.NullSubstitute("(EMPTY)"))
                .ForMember(x => x.ShipDescription, x => x.NullSubstitute("(EMPTY)"))
                .ForMember(x => x.Time, x => x.MapFrom(x => x.PickupPoint.Time));
            // DriverList
            CreateMap<Reservation, ReservationDriverListResource>()
                .ForMember(x => x.ExactPoint, x => x.MapFrom(x => x.PickupPoint.ExactPoint))
                .ForMember(x => x.Time, x => x.MapFrom(x => x.PickupPoint.Time))
                .ForMember(x => x.Fullname, x => x.MapFrom(x => x.Passengers.FirstOrDefault().Lastname + " " + x.Passengers.FirstOrDefault().Firstname));
            // Read reservation
            CreateMap<Reservation, ReservationReadResource>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(x.Date)))
                .ForMember(x => x.Driver, x => x.NullSubstitute(new Driver { Id = 0, Description = "(EMPTY)" }))
                .ForMember(x => x.Ship, x => x.NullSubstitute(new Ship { Id = 0, Description = "(EMPTY)" }))
                .ForMember(x => x.PickupPoint, x => x.MapFrom(r => new PickupPointWithPortDropdownResource {
                    Id = r.PickupPoint.Id,
                    Description = r.PickupPoint.Description,
                    ExactPoint = r.PickupPoint.ExactPoint,
                    Time = r.PickupPoint.Time,
                    Port = new SimpleResource {
                        Id = r.PickupPoint.Route.Port.Id,
                        Description = r.PickupPoint.Route.Port.Description
                    }
                }));
            // Read passenger
            CreateMap<Passenger, PassengerReadResource>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(x.Birthdate)));
            // Write reservation
            CreateMap<ReservationWriteResource, Reservation>();
            // Write passenger
            CreateMap<PassengerWriteResource, Passenger>();
        }

    }

}
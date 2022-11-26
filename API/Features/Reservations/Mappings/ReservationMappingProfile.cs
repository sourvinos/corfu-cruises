using System;
using System.Linq;
using API.Features.Drivers;
using API.Features.PickupPoints;
using API.Features.Ships;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using AutoMapper;

namespace API.Features.Reservations {

    public class ReservationMappingProfile : Profile {

        public ReservationMappingProfile() {
            // List
            CreateMap<Reservation, ReservationFinalListVM>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateHelpers.DateToISOString(x.Date)))
                .ForMember(x => x.CoachRouteAbbreviation, x => x.MapFrom(x => x.PickupPoint.CoachRoute.Abbreviation))
                .ForMember(x => x.DriverDescription, x => x.NullSubstitute("(EMPTY)"))
                .ForMember(x => x.PortDescription, x => x.MapFrom(x => x.PickupPoint.CoachRoute.Port.Description))
                .ForMember(x => x.ShipDescription, x => x.NullSubstitute("(EMPTY)"))
                .ForMember(x => x.Time, x => x.MapFrom(x => x.PickupPoint.Time))
                .ForMember(x => x.PassengerCount, x => x.MapFrom(x => x.Passengers.Count))
                .ForMember(x => x.PassengerDifference, x => x.MapFrom(x => x.TotalPersons - x.Passengers.Count));
            // DriverList
            CreateMap<Reservation, ReservationDriverListVM>()
                .ForMember(x => x.ExactPoint, x => x.MapFrom(x => x.PickupPoint.ExactPoint))
                .ForMember(x => x.Time, x => x.MapFrom(x => x.PickupPoint.Time))
                .ForMember(x => x.Fullname, x => x.MapFrom(x => x.Passengers.FirstOrDefault().Lastname + " " + x.Passengers.FirstOrDefault().Firstname));
            // Read reservation
            CreateMap<Reservation, ReservationReadDto>()
                .ForMember(x => x.Date, x => x.MapFrom(x => DateHelpers.DateToISOString(x.Date)))
                .ForMember(x => x.Driver, x => x.NullSubstitute(new Driver { Id = 0, Description = "(EMPTY)" }))
                .ForMember(x => x.Ship, x => x.NullSubstitute(new Ship { Id = 0, Description = "(EMPTY)" }))
                .ForMember(x => x.PickupPoint, x => x.MapFrom(r => new PickupPointActiveVM {
                    Id = r.PickupPoint.Id,
                    Description = r.PickupPoint.Description,
                    ExactPoint = r.PickupPoint.ExactPoint,
                    Time = r.PickupPoint.Time,
                    Port = new SimpleEntity {
                        Id = r.PickupPoint.CoachRoute.Port.Id,
                        Description = r.PickupPoint.CoachRoute.Port.Description
                    }
                }));
            // Read passenger
            CreateMap<Passenger, PassengerReadDto>()
                .ForMember(x => x.Birthdate, x => x.MapFrom(x => DateHelpers.DateToISOString(x.Birthdate)));
            // Write reservation
            CreateMap<ReservationWriteDto, Reservation>()
                .ForMember(x => x.LastUpdate, x => x.MapFrom(x => DateHelpers.DateTimeToISOString(DateTime.Now)));
            // Write passenger
            CreateMap<PassengerWriteDto, Passenger>()
                .ForMember(x => x.OccupantId, x => x.MapFrom(x => 2));
        }

    }

}
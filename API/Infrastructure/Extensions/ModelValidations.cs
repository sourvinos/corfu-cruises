using API.Features.Customers;
using API.Features.Destinations;
using API.Features.Drivers;
using API.Features.Genders;
using API.Features.Nationalities;
using API.Features.Occupants;
using API.Features.PickupPoints;
using API.Features.Ports;
using API.Features.Registrars;
using API.Features.Reservations;
using API.Features.Routes;
using API.Features.Schedules;
using API.Features.ShipCrews;
using API.Features.ShipRoutes;
using API.Features.Ships;
using API.Features.Vouchers;
using API.Infrastructure.Identity;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Extensions {

    public static class ModelValidations {

        public static void AddModelValidation(IServiceCollection services) {
            services.AddTransient<IValidator<CrewWriteResource>, CrewValidator>();
            services.AddTransient<IValidator<CustomerWriteResource>, CustomerValidator>();
            services.AddTransient<IValidator<DestinationWriteResource>, DestinationValidator>();
            services.AddTransient<IValidator<DriverWriteResource>, DriverValidator>();
            services.AddTransient<IValidator<GenderWriteResource>, GenderValidator>();
            services.AddTransient<IValidator<NationalityWriteResource>, NationalityValidator>();
            services.AddTransient<IValidator<OccupantWriteResource>, OccupantValidator>();
            services.AddTransient<IValidator<PickupPointWriteResource>, PickupPointValidator>();
            services.AddTransient<IValidator<PortWriteResource>, PortValidator>();
            services.AddTransient<IValidator<RegisterViewModel>, RegisterValidator>();
            services.AddTransient<IValidator<RegistrarWriteResource>, RegistrarValidator>();
            services.AddTransient<IValidator<ReservationWriteResource>, ReservationValidator>();
            services.AddTransient<IValidator<RouteWriteResource>, RouteValidator>();
            services.AddTransient<IValidator<Schedule>, ScheduleValidator>();
            services.AddTransient<IValidator<ShipRouteWriteResource>, ShipRouteValidator>();
            services.AddTransient<IValidator<ShipWriteResource>, ShipValidator>();
            services.AddTransient<IValidator<Voucher>, VoucherValidator>();
        }

    }

}
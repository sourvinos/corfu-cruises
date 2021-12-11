using BlueWaterCruises.Features.Crews;
using BlueWaterCruises.Features.Customers;
using BlueWaterCruises.Features.Destinations;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Features.Genders;
using BlueWaterCruises.Features.Nationalities;
using BlueWaterCruises.Features.Occupants;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Features.Registrars;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Routes;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Features.ShipRoutes;
using BlueWaterCruises.Features.Ships;
using BlueWaterCruises.Features.Vouchers;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace BlueWaterCruises {

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
            services.AddTransient<IValidator<Ship>, ShipValidator>();
            services.AddTransient<IValidator<ShipRouteWriteResource>, ShipRouteValidator>();
            services.AddTransient<IValidator<Voucher>, VoucherValidator>();
        }

    }

}
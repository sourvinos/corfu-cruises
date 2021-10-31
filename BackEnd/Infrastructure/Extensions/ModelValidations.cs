using BlueWaterCruises.Features.Customers;
using BlueWaterCruises.Features.Destinations;
using BlueWaterCruises.Features.Drivers;
using BlueWaterCruises.Features.Genders;
using BlueWaterCruises.Features.Nationalities;
using BlueWaterCruises.Features.Occupants;
using BlueWaterCruises.Features.PickupPoints;
using BlueWaterCruises.Features.Ports;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Features.Routes;
using BlueWaterCruises.Features.Schedules;
using BlueWaterCruises.Features.Ships;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace BlueWaterCruises {

    public static class ModelValidations {

        public static void AddModelValidation(IServiceCollection services) {
            services.AddTransient<IValidator<Crew>, CrewValidator>();
            services.AddTransient<IValidator<CustomerWriteResource>, CustomerValidator>();
            services.AddTransient<IValidator<Destination>, DestinationValidator>();
            services.AddTransient<IValidator<Driver>, DriverValidator>();
            services.AddTransient<IValidator<Gender>, GenderValidator>();
            services.AddTransient<IValidator<Nationality>, NationalityValidator>();
            services.AddTransient<IValidator<Occupant>, OccupantValidator>();
            services.AddTransient<IValidator<PickupPoint>, PickupPointValidator>();
            services.AddTransient<IValidator<Port>, PortValidator>();
            services.AddTransient<IValidator<RegisterViewModel>, RegisterValidator>();
            services.AddTransient<IValidator<Reservation>, ReservationValidator>();
            services.AddTransient<IValidator<Route>, RouteValidator>();
            services.AddTransient<IValidator<Schedule>, ScheduleValidator>();
            services.AddTransient<IValidator<Ship>, ShipValidator>();
        }


    }

}
using API.Features.Availability;
using API.Features.CoachRoutes;
using API.Features.Customers;
using API.Features.Destinations;
using API.Features.Drivers;
using API.Features.Embarkation;
using API.Features.Genders;
using API.Features.Invoicing;
using API.Features.Manifest;
using API.Features.Nationalities;
using API.Features.Occupants;
using API.Features.PickupPoints;
using API.Features.Ports;
using API.Features.Registrars;
using API.Features.Reservations;
using API.Features.Schedules;
using API.Features.ShipCrews;
using API.Features.ShipOwners;
using API.Features.ShipRoutes;
using API.Features.Ships;
using API.Infrastructure.Auth;
using API.Infrastructure.Implementations;
using API.Infrastructure.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Extensions {

    public static class Interfaces {

        public static void AddInterfaces(IServiceCollection services) {
            services.AddScoped<Token>();
            services.AddTransient<IAvailabilityRepository, AvailabilityRepository>();
            services.AddTransient<ICoachRouteRepository, CoachRouteRepository>();
            services.AddTransient<ICustomerRepository, CustomerRepository>();
            services.AddTransient<IDateTimeProvider, DateTimeProvider>();
            services.AddTransient<IDestinationRepository, DestinationRepository>();
            services.AddTransient<IDriverRepository, DriverRepository>();
            services.AddTransient<IEmbarkationRepository, EmbarkationRepository>();
            services.AddTransient<IGenderRepository, GenderRepository>();
            services.AddTransient<IGenderRepository, GenderRepository>();
            services.AddTransient<IInvoicingRepository, InvoicingRepository>();
            services.AddTransient<IManifestRepository, ManifestRepository>();
            services.AddTransient<INationalityRepository, NationalityRepository>();
            services.AddTransient<IOccupantRepository, OccupantRepository>();
            services.AddTransient<IPickupPointRepository, PickupPointRepository>();
            services.AddTransient<IPortRepository, PortRepository>();
            services.AddTransient<IRegistrarRepository, RegistrarRepository>();
            services.AddTransient<IReservationRepository, ReservationRepository>();
            services.AddTransient<IScheduleRepository, ScheduleRepository>();
            services.AddTransient<IShipCrewRepository, ShipCrewRepository>();
            services.AddTransient<IShipOwnerRepository, ShipOwnerRepository>();
            services.AddTransient<IShipRepository, ShipRepository>();
            services.AddTransient<IShipRouteRepository, ShipRouteRepository>();
            services.AddTransient<IValidReservation, ValidReservation>();
        }

    }

}


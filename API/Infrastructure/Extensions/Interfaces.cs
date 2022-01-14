using API.Features.ShipsCrews;
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
using API.Features.Reservations;
using API.Features.Routes;
using API.Features.Schedules;
using API.Features.Ships.Base;
using API.Features.Ships.Owners;
using API.Features.Ships.Registrars;
using API.Features.Ships.Routes;
using API.Infrastructure.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Extensions {

    public static class Interfaces {

        public static void AddInterfaces(IServiceCollection services) {
            services.AddScoped<Token>();
            services.AddTransient<IEmbarkationRepository, EmbarkationRepository>();
            services.AddTransient<ICrewRepository, CrewRepository>();
            services.AddTransient<ICustomerRepository, CustomerRepository>();
            services.AddTransient<IRegistrarRepository, RegistrarRepository>();
            services.AddTransient<IDestinationRepository, DestinationRepository>();
            services.AddTransient<IDriverRepository, DriverRepository>();
            services.AddTransient<IGenderRepository, GenderRepository>();
            services.AddTransient<IGenderRepository, GenderRepository>();
            services.AddTransient<IInvoicingRepository, InvoicingRepository>();
            services.AddTransient<IManifestRepository, ManifestRepository>();
            services.AddTransient<INationalityRepository, NationalityRepository>();
            services.AddTransient<IOccupantRepository, OccupantRepository>();
            services.AddTransient<IPickupPointRepository, PickupPointRepository>();
            services.AddTransient<IPortRepository, PortRepository>();
            services.AddTransient<IReservationRepository, ReservationRepository>();
            services.AddTransient<IRouteRepository, RouteRepository>();
            services.AddTransient<IScheduleRepository, ScheduleRepository>();
            services.AddTransient<IShipOwnerRepository, ShipOwnerRepository>();
            services.AddTransient<IShipRepository, ShipRepository>();
            services.AddTransient<IShipRouteRepository, ShipRouteRepository>();
        }

    }

}


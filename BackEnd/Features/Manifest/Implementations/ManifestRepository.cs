using AutoMapper;
using BlueWaterCruises.Features.Reservations;
using BlueWaterCruises.Infrastructure.Classes;
using BlueWaterCruises.Infrastructure.Implementations;
using Microsoft.Extensions.Options;

namespace BlueWaterCruises.Features.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(AppDbContext appDbContext, IMapper mapper, IOptions<TestingEnvironment> settings) : base(appDbContext, settings) {
            this.mapper = mapper;
        }

        public ManifestResource Get(string date, int destinationId, int portId, int vesselId) {
            var manifest = new ManifestViewModel();
            return mapper.Map<ManifestViewModel, ManifestResource>(manifest);
        }

    }

}
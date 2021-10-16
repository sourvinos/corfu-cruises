using AutoMapper;
using BlueWaterCruises.Features.Reservations;

namespace BlueWaterCruises.Features.Manifest {

    public class ManifestRepository : Repository<Reservation>, IManifestRepository {

        private readonly IMapper mapper;

        public ManifestRepository(AppDbContext appDbContext, IMapper mapper) : base(appDbContext) {
            this.mapper = mapper;
        }

        public ManifestResource Get(string date, int destinationId, int portId, int vesselId) {
            var manifest = new ManifestViewModel();
            return mapper.Map<ManifestViewModel, ManifestResource>(manifest);
        }

    }

}
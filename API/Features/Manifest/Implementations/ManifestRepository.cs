using API.Features.Reservations;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using AutoMapper;
using Microsoft.Extensions.Options;

namespace API.Features.Manifest {

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
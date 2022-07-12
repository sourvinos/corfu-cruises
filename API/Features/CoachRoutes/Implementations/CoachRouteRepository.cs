using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Implementations;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Features.CoachRoutes {

    public class CoachRouteRepository : Repository<CoachRoute>, ICoachRouteRepository {

        private readonly IMapper mapper;

        public CoachRouteRepository(AppDbContext context, IMapper mapper, IOptions<TestingEnvironment> settings) : base(context, settings) {
            this.mapper = mapper;
        }

        public async Task<IEnumerable<CoachRouteListVM>> Get() {
            List<CoachRoute> records = await context.CoachRoutes
                .OrderBy(x => x.Description)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<CoachRoute>, IEnumerable<CoachRouteListVM>>(records);
        }

        public async Task<IEnumerable<CoachRouteActiveForDropdownVM>> GetActiveForDropdown() {
            List<CoachRoute> records = await context.CoachRoutes
                .Where(x => x.IsActive)
                .OrderBy(x => x.Abbreviation)
                .AsNoTracking()
                .ToListAsync();
            return mapper.Map<IEnumerable<CoachRoute>, IEnumerable<CoachRouteActiveForDropdownVM>>(records);
        }

        public new async Task<CoachRouteReadDto> GetById(int id) {
            CoachRoute record = await context.CoachRoutes
                .Include(x => x.Port)
                .SingleOrDefaultAsync(m => m.Id == id);
            if (record != null) {
                return mapper.Map<CoachRoute, CoachRouteReadDto>(record);
            } else {
                throw new CustomException { HttpResponseCode = 404 };
            }
        }

        public async Task<CoachRoute> GetByIdToDelete(int id) {
            return await context.CoachRoutes.SingleOrDefaultAsync(x => x.Id == id);
        }

        public int IsValid(CoachRouteWriteDto record) {
            return true switch {
                var x when x == !IsValidPort(record) => 450,
                _ => 200,
            };
        }

        private bool IsValidPort(CoachRouteWriteDto record) {
            bool isValid = false;
            if (record.Id == 0) {
                isValid = context.Ports.SingleOrDefault(x => x.Id == record.PortId && x.IsActive) != null;
            } else {
                isValid = context.Ports.SingleOrDefault(x => x.Id == record.PortId) != null;
            }
            return isValid;
        }

    }

}
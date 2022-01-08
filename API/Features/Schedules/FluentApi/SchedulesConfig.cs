using API.Features.Schedules;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.FluentApi {

    internal class SchedulesConfig : IEntityTypeConfiguration<Schedule> {

        public void Configure(EntityTypeBuilder<Schedule> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.PortId).IsRequired(true);
            entity.Property(x => x.DestinationId).IsRequired(true);
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Date).HasColumnType("date").HasMaxLength(10).IsRequired(true);
            entity.Property(x => x.MaxPersons).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.Port).WithMany(x => x.Schedules).HasForeignKey(x => x.PortId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Destination).WithMany(x => x.Schedules).HasForeignKey(x => x.DestinationId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.User).WithMany(x => x.Schedules).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}
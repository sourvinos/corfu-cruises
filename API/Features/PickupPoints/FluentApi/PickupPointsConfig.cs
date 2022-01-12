using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Features.PickupPoints {

    internal class PickupPointsConfig : IEntityTypeConfiguration<PickupPoint> {

        public void Configure(EntityTypeBuilder<PickupPoint> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.RouteId).IsRequired(true);
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.ExactPoint).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Time).HasMaxLength(5).IsRequired(true);
            entity.Property(x => x.Coordinates).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsActive);
            // FK Constraints
            entity.HasOne(x => x.Route).WithMany(x => x.PickupPoints).HasForeignKey(x => x.RouteId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.User).WithMany(x => x.PickupPoints).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}
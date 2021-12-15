using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.Features.Ships.Base {

    internal class ShipsConfig : IEntityTypeConfiguration<Ship> {

        public void Configure(EntityTypeBuilder<Ship> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.ShipOwnerId).IsRequired(true);
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IMO).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Flag).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.RegistryNo).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Manager).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.ManagerInGreece).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Agent).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsActive).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.ShipOwner).WithMany(x => x.Ships).HasForeignKey(x => x.ShipOwnerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.User).WithMany(x => x.Ships).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}
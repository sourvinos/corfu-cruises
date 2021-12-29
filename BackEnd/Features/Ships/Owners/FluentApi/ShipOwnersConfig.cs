using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.Features.Ships.Owners {

    internal class ShipOwnersConfig : IEntityTypeConfiguration<ShipOwner> {

        public void Configure(EntityTypeBuilder<ShipOwner> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Profession).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.Address).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.TaxNo).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.City).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.Phones).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.Email).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.IsActive).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.ShipOwners).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}
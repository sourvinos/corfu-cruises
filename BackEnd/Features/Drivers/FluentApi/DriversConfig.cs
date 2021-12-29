using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlueWaterCruises.Features.Drivers {

    internal class DriversConfig : IEntityTypeConfiguration<Driver> {

        public void Configure(EntityTypeBuilder<Driver> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.Phones).HasDefaultValue("").HasMaxLength(128);
            entity.Property(x => x.IsActive).IsRequired(true);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Drivers).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}
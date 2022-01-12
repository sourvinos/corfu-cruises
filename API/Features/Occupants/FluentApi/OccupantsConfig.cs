using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Features.Occupants {

    internal class OccupantsConfig : IEntityTypeConfiguration<Occupant> {

        public void Configure(EntityTypeBuilder<Occupant> entity) {
            // PK
            entity.Property(x => x.Id).ValueGeneratedOnAdd();
            // FKs
            entity.Property(x => x.UserId).IsRequired(true);
            // Fields
            entity.Property(x => x.Description).HasMaxLength(128).IsRequired(true);
            entity.Property(x => x.IsActive);
            // FK Constraints
            entity.HasOne(x => x.User).WithMany(x => x.Occupants).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        }

    }

}
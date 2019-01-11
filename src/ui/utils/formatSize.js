const KiB = 1024;
const MiB = KiB ** 2;
const GiB = KiB ** 3;

export default size => (
  size > GiB ? `${(size / GiB).toFixed(2)} GiB`
    : size > MiB ? `${(size / MiB).toFixed(2)} MiB`
      : size > KiB ? `${(size / KiB).toFixed(2)} KiB`
        : `${size} Bytes`
);

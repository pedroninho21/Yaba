import PropTypes from 'prop-types';

function ColorBadge({ color, height, width }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: '100%',
        border: '1px solid lightgray',
        backgroundColor: color || 'white',
      }}
    />
  );
}
ColorBadge.propTypes = {
  color: PropTypes.string.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
};
ColorBadge.defaultProps = {
  height: '1em',
  width: '1em',
};

export default ColorBadge;

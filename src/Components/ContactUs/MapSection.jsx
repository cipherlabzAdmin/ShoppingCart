import WrapperComponent from '../Common/WrapperComponent';

const MapSection = () => {
  return (
    <WrapperComponent classes={{ sectionClass: 'map-section', fluidClass: 'p-0' }} noRowCol={true}>
      <div className='map-box'>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.23167092986!2d79.92822457359179!3d6.981965617668802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae257e32a26d20f%3A0xd82ebec986b0070!2s237%20Kandy%20Rd%2C%20Kiribathgoda%2011600!5e0!3m2!1sen!2slk!4v1730905370022!5m2!1sen!2slk'
          style={{ border: 0 }}
          allowFullScreen=''
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'></iframe>
      </div>
    </WrapperComponent>
  );
};

export default MapSection;

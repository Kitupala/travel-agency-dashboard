const InfoPill = ({ text, image, classNames }: InfoPillProps) => {
  return (
    <figure className="info-pill">
      <img src={image} alt={text} />
      <figcaption className={classNames}>{text}</figcaption>
    </figure>
  );
};

export default InfoPill;

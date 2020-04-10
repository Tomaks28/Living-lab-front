import React from "react";
import { Card, CardTitle, CardText } from "react-mdl";

const Photos = (props) => {
  if (!props.photos.length) {
    return null;
  }

  return (
    <div className="photos">
      {props.photos.map((photo) => (
        <Card
          key={photo.id}
          shadow={0}
          style={{
            background: "url(" + photo.images[0] + ") center / cover",
          }}
          className="photo"
          onClick={() =>
            props.handleClick([photo.location.lat, photo.location.lng])
          }
        >
          <CardTitle
            style={{
              color: "#fff",
              height: "176px",
              width: "512px",
              fontSize: 10,
            }}
          >
            {photo.title}
          </CardTitle>
          <CardText>{photo.price} €</CardText>
        </Card>
      ))}
    </div>
  );
};

export default Photos;

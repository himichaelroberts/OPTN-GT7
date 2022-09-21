// import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

type CarCardProps = {
  make: string;
  name: string;
  country: string;
}

export default function CarCard({ name, make, country }: CarCardProps) {
  const img_url = encodeURI(`${make} ${name}`);

  const handleImageError = (e: unknown) => {
    e.target.onerror = null;
    // e.target.style.display = 'none'
    e.target.src = "https://picsum.photos/345/140"
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="175"
        image={`https://jwwfejqbidkztahfvrlv.supabase.co/storage/v1/object/public/cars/${img_url}.webp`}
        alt={`${make} ${name}`}
        onError={handleImageError}
      />
      <CardContent>
        <Typography gutterBottom variant="subtitle1" component="div">
          {make} {name}
        </Typography>

      </CardContent>


    </Card>
  )
}

// Car Listings Controller
// Handles operations related to listing cars

import path from 'path';
import crypto from 'crypto';
import { supabase } from '../config/db.js';

/**
 * Fetch approved cars with their related images.
 */
export const getApprovedCars = async (req, res) => {
  try {
    // 1) Fetch approved cars
    const { data: cars, error: carsError } = await supabase
      .from('cars_listings')
      .select('*')
      .eq('status', 'approved');

    if (carsError) {
      throw carsError;
    }

    const carIds = cars.map((car) => car.id).filter(Boolean);

    // 2) Fetch related images for all approved cars
    let images = [];
    if (carIds.length > 0) {
      const { data, error: imagesError } = await supabase
        .from('car_images')
        .select('car_id, image_url')
        .in('car_id', carIds);

      if (imagesError) {
        throw imagesError;
      }

      images = data;
    }

    if (imagesError) {
      throw imagesError;
    }

    // 3) Combine cars with their images
    const imagesByCarId = images.reduce((acc, img) => {
      const key = img.car_id;
      if (!acc[key]) acc[key] = [];
      if (img.image_url) acc[key].push(img.image_url);
      return acc;
    }, {});

    const result = cars.map((car) => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      listing_price: car.listing_price,
      images: imagesByCarId[car.id] || []
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching approved cars:', error);
    res.status(500).json({ error: 'Failed to fetch approved cars' });
  }
};

/**
 * Create a new car listing and upload provided images to Supabase Storage.
 *
 * Expects multipart/form-data with fields for the car listing and images.
 */
export const createCarListing = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      seller_price,
      listing_price,
      location,
      mileage,
      fuel_type,
      transmission,
      owner_type,
      description
    } = req.body;

    // Basic validation
    if (!brand || !model || !year || !listing_price) {
      return res.status(400).json({
        error: 'Missing required fields: brand, model, year, listing_price'
      });
    }

    // Insert car record
    const { data: car, error: carError } = await supabase
      .from('cars_listings')
      .insert([
        {
          brand,
          model,
          year: Number(year),
          seller_price: seller_price ? Number(seller_price) : null,
          listing_price: Number(listing_price),
          location,
          mileage: mileage ? Number(mileage) : null,
          fuel_type,
          transmission,
          owner_type,
          description,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (carError) {
      throw carError;
    }

    const carId = car.id;

    // Handle image uploads (multipart/form-data)
    const files = req.files || [];
    const uploadedImages = [];

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const ext = path.extname(file.originalname) || '';
      const key = `${carId}/${crypto.randomUUID()}${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(key, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.warn('Failed to upload image to storage:', uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(key);

      uploadedImages.push({
        car_id: carId,
        image_url: publicUrlData.publicUrl,
        position: i + 1
      });
    }

    // Insert image records
    if (uploadedImages.length > 0) {
      const { error: imagesInsertError } = await supabase
        .from('car_images')
        .insert(uploadedImages);

      if (imagesInsertError) {
        throw imagesInsertError;
      }
    }

    res.status(201).json({
      ...car,
      images: uploadedImages.map((img) => img.image_url)
    });
  } catch (error) {
    console.error('Error creating car listing:', error);
    res.status(500).json({ error: 'Failed to create car listing' });
  }
};

export const getCarById = (req, res) => {
  const { id } = req.params;
  // TODO: Fetch specific car by ID
  res.status(200).json({
    message: `Get car with ID: ${id}`,
    car: {}
  });
};

export const searchCars = (req, res) => {
  const { brand, budget, year, fuelType } = req.query;
  // TODO: Search cars based on filters
  res.status(200).json({
    message: 'Search cars',
    filters: { brand, budget, year, fuelType },
    results: []
  });
};

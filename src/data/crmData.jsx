export const initialCrmData = {
  clients: [
    {
      client_id: "b4d642ad-078a-4b20-b0bb-0dc5b05f24b3",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: { street: "123 Main St", city: "Anytown", state: "CA", zip: "12345" },
      referral_source: "Referral",
      referred_by_id: null,
      vip_status: true,
      communication_pref: "Email",
      notes: "Prefers slim fit, upcoming wedding in June",
      no_show_count: 0
    },
    {
      client_id: "a9c6eed8-85e2-48e6-9ece-bc4e1723322f",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      phone: "987-654-3210",
      address: { street: "456 Elm St", city: "Othertown", state: "NY", zip: "67890" },
      referral_source: "Referral",
      referred_by_id: "b4d642ad-078a-4b20-b0bb-0dc5b05f24b3",
      vip_status: false,
      communication_pref: "SMS",
      notes: "Allergic to wool",
      no_show_count: 0
    },
    {
      client_id: "eb9c5918-9361-485c-9c93-3ad1943c1dca",
      first_name: "Bob",
      last_name: "Johnson",
      email: "bob@example.com",
      phone: "555-123-4567",
      address: { street: "789 Oak St", city: "Sometown", state: "TX", zip: "11223" },
      referral_source: "Google",
      referred_by_id: "a9c6eed8-85e2-48e6-9ece-bc4e1723322f",
      vip_status: true,
      communication_pref: "Phone",
      notes: "Corporate executive, needs quick turnarounds",
      no_show_count: 0
    }
  ],
  measurements: [
    {
      client_id: "b4d642ad-078a-4b20-b0bb-0dc5b05f24b3",
      chest: 42.5, shoulder_width: 18.0, back_length: 30.5, bicep: 15.0, torso_length: 24.0, half_back: 9.0,
      waist: 34.0, hips: 38.0, inseam: 32.0, outseam: 42.0, thigh: 24.0, knee: 18.0,
      collar_size: 16.5, sleeve_length: 34.0, cuff_circumference: 10.0, wrist: 7.0, height: 72.0, weight: 180.0
    },
    {
      client_id: "a9c6eed8-85e2-48e6-9ece-bc4e1723322f",
      chest: 36.0, shoulder_width: 16.5, back_length: 28.0, bicep: 13.0, torso_length: 22.0, half_back: 8.0,
      waist: 28.0, hips: 36.0, inseam: 30.0, outseam: 40.0, thigh: 22.0, knee: 16.0,
      collar_size: 14.5, sleeve_length: 32.0, cuff_circumference: 9.0, wrist: 6.5, height: 65.0, weight: 140.0
    },
    {
      client_id: "eb9c5918-9361-485c-9c93-3ad1943c1dca",
      chest: 44.0, shoulder_width: 19.0, back_length: 31.0, bicep: 16.0, torso_length: 25.0, half_back: 9.5,
      waist: 36.0, hips: 40.0, inseam: 33.0, outseam: 43.0, thigh: 25.0, knee: 19.0,
      collar_size: 17.0, sleeve_length: 35.0, cuff_circumference: 10.5, wrist: 7.5, height: 74.0, weight: 200.0
    }
  ],
  style_preferences: [
    {
      client_id: "b4d642ad-078a-4b20-b0bb-0dc5b05f24b3",
      lapel_style: "Notch", button_stance: "2-button", trouser_break: "Slight", pleat_preference: "Flat-front",
      collar_style: "Spread", cuff_style: "Barrel", monogram_preference: { location: "Cuff", style: "Block", color: "White" },
      fit_preference: "Slim", fabric_preferences: ["Cotton", "Wool", "Blue", "Solid"]
    },
    {
      client_id: "a9c6eed8-85e2-48e6-9ece-bc4e1723322f",
      lapel_style: "Peak", button_stance: "3-button", trouser_break: "Medium", pleat_preference: "Single pleat",
      collar_style: "Point", cuff_style: "French", monogram_preference: { location: "Collar", style: "Script", color: "Black" },
      fit_preference: "Classic", fabric_preferences: ["Linen", "Cotton", "White", "Stripe"]
    },
    {
      client_id: "eb9c5918-9361-485c-9c93-3ad1943c1dca",
      lapel_style: "Shawl", button_stance: "Double-breasted", trouser_break: "Full", pleat_preference: "Double pleat",
      collar_style: "Cutaway", cuff_style: "Convertible", monogram_preference: { location: "Pocket", style: "Monogram", color: "Gold" },
      fit_preference: "Relaxed", fabric_preferences: ["Silk", "Blend", "Gray", "Plaid"]
    }
  ],
  orders: [
    {
      order_id: "19308515-8f97-415f-8eab-16f178a27a7b",
      client_id: "b4d642ad-078a-4b20-b0bb-0dc5b05f24b3",
      order_type: "Custom Suit", status: "Ready", fabric_id: "89f7e50a-ac22-43fe-8151-756f34c0142f",
      total_price: 1500.0, deposit_paid: 750.0, balance_due: 750.0, financing_type: "None",
      due_date: "2025-01-15", event_date: "2025-06-20", photos: ["https://via.placeholder.com/150?text=SuitPhoto"],
      specifications: { buttons: "Mother of Pearl", lining: "Silk" }
    },
    {
      order_id: "9268d9b7-30ce-45c7-934b-0467ab4587a9",
      client_id: "a9c6eed8-85e2-48e6-9ece-bc4e1723322f",
      order_type: "Custom Shirt", status: "In Production", fabric_id: "03268d80-8c53-4849-8210-8e8ed42f3c5f",
      total_price: 200.0, deposit_paid: 100.0, balance_due: 100.0, financing_type: "None",
      due_date: "2025-02-01", event_date: null, photos: [], specifications: { collar: "Spread" }
    },
    {
      order_id: "fabad4f6-9efc-467c-a689-1e8133bba01e",
      client_id: "eb9c5918-9361-485c-9c93-3ad1943c1dca",
      order_type: "Alteration", status: "Picked Up", fabric_id: null,
      total_price: 50.0, deposit_paid: 50.0, balance_due: 0.0, financing_type: "None",
      due_date: "2024-12-20", event_date: null, photos: [], specifications: { type: "Hem pants" }
    }
  ],
  activities: [
    {
      activity_id: "50d6910a-6443-4a1f-a2c4-c0ae94afd334",
      client_id: "b4d642ad-078a-4b20-b0bb-0dc5b05f24b3",
      activity_type: "Note Added", subject: "Preference Update", body: "Client prefers navy colors",
      created_by: "admin", created_at: "2024-12-01T10:00:00Z"
    },
    {
      activity_id: "597760cb-9955-4329-9fa2-3ce7a18b8994",
      client_id: "a9c6eed8-85e2-48e6-9ece-bc4e1723322f",
      activity_type: "Order Created", subject: "New Shirt Order", body: "Order for custom shirt placed",
      created_by: "system", created_at: "2024-12-10T14:30:00Z"
    },
    {
      activity_id: "f1f8f6c3-413b-4ba5-a079-fcb6de92f0c3",
      client_id: "eb9c5918-9361-485c-9c93-3ad1943c1dca",
      activity_type: "Phone Call", subject: "Consultation Follow-up", body: "Discussed fabric options",
      created_by: "admin", created_at: "2024-12-15T09:00:00Z"
    }
  ],
  appointments: [ 
    {
      appointment_id: "appt-1",
      client_id: "b4d642ad-078a-4b20-b0bb-0dc5b05f24b3",
      type: "Consultation",
      start_time: "2025-12-23T11:00:00", // Dec 23, 2025 11:00 AM
      duration_minutes: 60,
      status: "Scheduled",
      notes: "Initial suit consultation"
    },
    {
      appointment_id: "appt-2",
      client_id: "a9c6eed8-85e2-48e6-9ece-bc4e1723322f",
      type: "Fitting",
      start_time: "2025-12-24T14:30:00",
      duration_minutes: 30,
      status: "Scheduled",
      notes: ""
    }
  ],
   fabrics: [
    { 
      fabric_id: "f1", 
      name: "BREZZA ZEPHIR", 
      supplier: "Tessitura Monti", 
      type: "Cotton", 
      pattern: "Solid", 
      color_primary: "Navy", 
      weight: 120, 
      swatch_photo: "https://via.placeholder.com/100?text=Navy+Cotton" 
    },
    { 
      fabric_id: "f2", 
      name: "BOEING POPELINE", 
      supplier: "SICTESS", 
      type: "Cotton", 
      pattern: "Stripe", 
      color_primary: "White", 
      weight: 110,
      swatch_photo: "https://via.placeholder.com/100?text=White+Stripe" 
    },
    { 
      fabric_id: "f3", 
      name: "Super 150s Wool", 
      supplier: "Other", 
      type: "Wool", 
      pattern: "Check", 
      color_primary: "Gray", 
      weight: 130,
      swatch_photo: "https://via.placeholder.com/100?text=Gray+Wool" 
    }
  ]
};
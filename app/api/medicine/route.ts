import { NextResponse } from 'next/server'

// Define the medicine data structure
interface MedicineInfo {
  id: string
  name: string
  composition: string[]
  purpose: string
  mechanism: string
  precautions: {
    pregnancy: string
    allergies: string[]
    interactions: string[]
  }
  sideEffects: string[]
  dosage: {
    adults: string
    children: string
    elderly: string
  }
  alternatives: string[]
  foodInteractions: string[]
  overdoseInfo: string
  usageInstructions: string[]
}

// Function to fetch medicine data from OpenFDA API
async function fetchMedicineData(medicineName: string) {
  try {
    // Try without API key first (OpenFDA allows limited access without key)
    let labelResponse = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${medicineName}" OR openfda.generic_name:"${medicineName}"&limit=1`
    );
    
    // If we get a rate limit error, try with a short delay
    if (labelResponse.status === 429) {
      // Wait 1 second and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
      labelResponse = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${medicineName}" OR openfda.generic_name:"${medicineName}"&limit=1`
      );
    }
    
    if (!labelResponse.ok) {
      throw new Error(`Failed to fetch from OpenFDA: ${labelResponse.status}`);
    }
    
    const labelData = await labelResponse.json();
    
    if (!labelData.results || labelData.results.length === 0) {
      // If no results found, try with partial matching
      let partialResponse = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${medicineName}*&limit=1`
      );
      
      // If we get a rate limit error, try with a short delay
      if (partialResponse.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        partialResponse = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${medicineName}*&limit=1`
        );
      }
      
      if (!partialResponse.ok) {
        throw new Error(`Failed to fetch from OpenFDA: ${partialResponse.status}`);
      }
      
      const partialData = await partialResponse.json();
      
      if (!partialData.results || partialData.results.length === 0) {
        return null;
      }
      
      return mapOpenFDAToMedicineInfo(partialData.results[0], medicineName);
    }
    
    return mapOpenFDAToMedicineInfo(labelData.results[0], medicineName);
  } catch (error) {
    console.error('Error fetching medicine data:', error);
    return null;
  }
}

// Function to map OpenFDA data to our MedicineInfo structure
function mapOpenFDAToMedicineInfo(fdaData: any, searchName: string): MedicineInfo {
  const openfda = fdaData.openfda || {};
  
  return {
    id: fdaData.id || 'unknown',
    name: openfda.brand_name?.[0] || openfda.generic_name?.[0] || searchName,
    composition: openfda.substance_name || [],
    purpose: fdaData.purpose?.[0] || 'Information not available',
    mechanism: fdaData.mechanism_of_action?.[0] || 'Mechanism of action information not available',
    precautions: {
      pregnancy: fdaData.pregnancy?.[0] || 'Pregnancy information not available',
      allergies: openfda.substance_name || [],
      interactions: fdaData.drug_interactions?.map((i: any) => i.description) || []
    },
    sideEffects: fdaData.adverse_reactions?.[0] ? [fdaData.adverse_reactions[0]] : ['Side effects information not available'],
    dosage: {
      adults: fdaData.dosage_and_administration?.[0] || 'Dosage information not available',
      children: fdaData.pediatric_use?.[0] || 'Pediatric dosage information not available',
      elderly: fdaData.geriatric_use?.[0] || 'Geriatric dosage information not available'
    },
    alternatives: [], // This would require additional API calls to determine
    foodInteractions: fdaData.food_interactions || ['Food interaction information not available'],
    overdoseInfo: fdaData.overdosage?.[0] || 'Overdose information not available',
    usageInstructions: fdaData.dosage_and_administration?.[0] ? [fdaData.dosage_and_administration[0]] : ['Usage instructions not available']
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const medicineName = searchParams.get('name')
  
  if (!medicineName) {
    return NextResponse.json(
      { error: 'Medicine name is required' }, 
      { status: 400 }
    )
  }
  
  try {
    const medicineData = await fetchMedicineData(medicineName);
    
    if (medicineData) {
      return NextResponse.json({
        success: true,
        data: medicineData
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Medicine not found in OpenFDA database' 
        }, 
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error in medicine API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred while fetching medicine information: ' + error.message
      }, 
      { status: 500 }
    );
  }
}

// For future implementation with POST requests
export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'POST method not implemented' }, 
    { status: 501 }
  )
}
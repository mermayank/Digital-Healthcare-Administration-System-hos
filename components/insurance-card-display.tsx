import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { IndianRupee, Edit3, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InsuranceCardDisplayProps {
  card: {
    provider: { name: string };
    cardNumber: string;
    holderName: string;
    policyNumber?: string;
    expiryDate: string;
    coverageAmount?: number;
    status: string;
  };
  editable?: boolean;
  onSave?: (updatedCard: any) => void;
}

export function InsuranceCardDisplay({ card, editable = false, onSave }: InsuranceCardDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(card);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedCard(card);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(editedCard);
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedCard(card);
    setIsEditing(false);
  };
  
  const handleInputChange = (field: string, value: string) => {
    setEditedCard(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const displayCard = isEditing ? editedCard : card;
  
  return (
    <div className="relative max-w-md mx-auto">
      {/* Insurance Card Visual Representation */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl shadow-xl overflow-hidden border-2 border-blue-800">
        {/* Card Header with Provider */}
        <div className="bg-blue-800 p-4">
          <div className="flex justify-between items-start">
            <div>
              {isEditing ? (
                <Input
                  value={editedCard.provider.name}
                  onChange={(e) => handleInputChange('provider.name', e.target.value)}
                  className="text-white font-bold text-xl bg-blue-900 border-blue-600"
                />
              ) : (
                <h3 className="text-white font-bold text-xl">{displayCard.provider.name}</h3>
              )}
              <p className="text-blue-200 text-sm">Health Insurance</p>
            </div>
            <div className="bg-white text-blue-800 px-2 py-1 rounded text-xs font-bold">
              {displayCard.status}
            </div>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="p-6">
          {/* Card Chip */}
          <div className="bg-yellow-400 w-12 h-8 rounded-md mb-6"></div>
          
          {/* Card Number */}
          <div className="mb-6">
            <p className="text-blue-200 text-xs uppercase">Card Number</p>
            {isEditing ? (
              <Input
                value={editedCard.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="text-white text-xl font-mono tracking-wider bg-blue-900 border-blue-600"
              />
            ) : (
              <p className="text-white text-xl font-mono tracking-wider">{displayCard.cardNumber}</p>
            )}
          </div>
          
          {/* Card Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-200 text-xs uppercase">Card Holder</p>
              {isEditing ? (
                <Input
                  value={editedCard.holderName}
                  onChange={(e) => handleInputChange('holderName', e.target.value)}
                  className="text-white font-medium bg-blue-900 border-blue-600"
                />
              ) : (
                <p className="text-white font-medium">{displayCard.holderName}</p>
              )}
            </div>
            <div>
              <p className="text-blue-200 text-xs uppercase">Expiry Date</p>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedCard.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="text-white font-medium bg-blue-900 border-blue-600"
                />
              ) : (
                <p className="text-white font-medium">
                  {new Date(displayCard.expiryDate).toLocaleDateString('en-US', { 
                    month: '2-digit', 
                    year: '2-digit' 
                  })}
                </p>
              )}
            </div>
            <div>
              <p className="text-blue-200 text-xs uppercase">Policy Number</p>
              {isEditing ? (
                <Input
                  value={editedCard.policyNumber || ''}
                  onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                  className="text-white font-medium bg-blue-900 border-blue-600"
                  placeholder="Policy Number"
                />
              ) : (
                <p className="text-white font-medium">{displayCard.policyNumber || 'N/A'}</p>
              )}
            </div>
            <div>
              <p className="text-blue-200 text-xs uppercase">Coverage</p>
              {isEditing ? (
                <div className="flex items-center">
                  <IndianRupee className="w-4 h-4 text-white" />
                  <Input
                    type="number"
                    value={editedCard.coverageAmount || ''}
                    onChange={(e) => handleInputChange('coverageAmount', e.target.value)}
                    className="text-white font-medium bg-blue-900 border-blue-600 ml-1"
                  />
                </div>
              ) : (
                <p className="text-white font-medium flex items-center">
                  {displayCard.coverageAmount ? (
                    <>
                      <IndianRupee className="w-4 h-4" />
                      {displayCard.coverageAmount.toLocaleString('en-IN')}
                    </>
                  ) : (
                    'N/A'
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Card Footer */}
        <div className="bg-blue-800 p-4 text-center">
          <p className="text-blue-200 text-xs">This card is valid for medical services</p>
        </div>
      </div>
      
      {/* Edit/Save Buttons */}
      {editable && (
        <div className="mt-4 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Card
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
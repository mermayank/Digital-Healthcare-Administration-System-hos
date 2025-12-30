import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
}

interface ProviderSelectorProps {
  providers: Provider[];
  selectedProviderId: string;
  onProviderChange: (providerId: string) => void;
  onCustomProviderChange?: (name: string) => void;
  customProviderName?: string;
}

export function ProviderSelector({ 
  providers, 
  selectedProviderId, 
  onProviderChange,
  onCustomProviderChange,
  customProviderName = ''
}: ProviderSelectorProps) {
  const [useCustomProvider, setUseCustomProvider] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProviders = providers.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProviderSelect = (value: string) => {
    if (value === 'custom') {
      setUseCustomProvider(true);
      onProviderChange('');
    } else {
      setUseCustomProvider(false);
      onProviderChange(value);
    }
  };

  const handleCustomProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onCustomProviderChange) {
      onCustomProviderChange(value);
    }
  };

  return (
    <div className="space-y-4">
      {!useCustomProvider ? (
        <div className="space-y-2">
          <Label htmlFor="providerId" className="dark:text-gray-300">Insurance Provider</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Select 
            value={selectedProviderId} 
            onValueChange={handleProviderSelect}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {filteredProviders.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
              <SelectItem value="custom">
                <div className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Provider
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="customProvider" className="dark:text-gray-300">Custom Provider Name</Label>
          <div className="flex space-x-2">
            <Input
              id="customProvider"
              value={customProviderName}
              onChange={handleCustomProviderChange}
              placeholder="Enter provider name"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setUseCustomProvider(false)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Character } from '../types';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem('rp-characters');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load characters from local storage', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('rp-characters', JSON.stringify(characters));
  }, [characters]);

  const addCharacter = (char: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newChar: Character = {
      ...char,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCharacters((prev) => [newChar, ...prev]);
    return newChar;
  };

  const updateCharacter = (id: string, updates: Partial<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, ...updates, updatedAt: Date.now() } : char))
    );
  };

  const deleteCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((char) => char.id !== id));
  };

  return {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  };
}

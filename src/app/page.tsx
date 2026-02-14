'use client';

import { useState, useCallback } from 'react';
import type { RoomConfig, DesignResult, GenerationProgress, LoadingState } from '@/lib/types';
import { 
  ROOM_TYPES, 
  STYLES, 
  COLOR_SCHEMES, 
  BUDGET_RANGES, 
  ROOM_SIZES,
  DEFAULT_CONFIG 
} from '@/lib/constants';
import { generateAllDesigns } from '@/lib/hf-service';

type TabType = 'image' | 'description' | 'colors' | 'furniture';

export default function Home() {
  const [config, setConfig] = useState<RoomConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<DesignResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [progress, setProgress] = useState<GenerationProgress>({
    image: 'idle',
    description: 'idle',
    colors: 'idle',
    furniture: 'idle',
  });
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setProgress({
      image: 'loading',
      description: 'loading',
      colors: 'loading',
      furniture: 'loading',
    });

    try {
      // Simulate progress updates for better UX
      setTimeout(() => {
        setProgress(prev => ({ ...prev, colors: 'success' }));
      }, 500);

      setTimeout(() => {
        setProgress(prev => ({ ...prev, furniture: 'success' }));
      }, 800);

      setTimeout(() => {
        setProgress(prev => ({ ...prev, description: 'success' }));
      }, 1500);

      const designResult = await generateAllDesigns(config);
      setResult(designResult);
      
      setProgress(prev => ({ ...prev, image: 'success' }));
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate designs. Please try again.');
      setProgress({
        image: 'error',
        description: 'error',
        colors: 'error',
        furniture: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  const handleConfigChange = (key: keyof RoomConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const getLoadingProgress = () => {
    const total = Object.values(progress).filter(v => v === 'success').length;
    return (total / 4) * 100;
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>InteriorAI</h1>
            <span>AI-Powered Interior Design</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Input Panel */}
        <aside className="input-panel">
          <div className="card">
            <h2 style={{ marginBottom: 'var(--spacing-lg)', fontSize: '24px' }}>
              Configure Your Room
            </h2>

            <div className="input-section">
              <label className="input-label">Room Type</label>
              <div className="select-wrapper">
                <select
                  className="select"
                  value={config.roomType}
                  onChange={(e) => handleConfigChange('roomType', e.target.value)}
                >
                  {ROOM_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="input-section" style={{ marginTop: 'var(--spacing-lg)' }}>
              <label className="input-label">Style</label>
              <div className="select-wrapper">
                <select
                  className="select"
                  value={config.style}
                  onChange={(e) => handleConfigChange('style', e.target.value)}
                >
                  {STYLES.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="input-section" style={{ marginTop: 'var(--spacing-lg)' }}>
              <label className="input-label">Color Scheme</label>
              <div className="select-wrapper">
                <select
                  className="select"
                  value={config.colorScheme}
                  onChange={(e) => handleConfigChange('colorScheme', e.target.value)}
                >
                  {COLOR_SCHEMES.map((scheme) => (
                    <option key={scheme} value={scheme}>{scheme}</option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="input-section" style={{ marginTop: 'var(--spacing-lg)' }}>
              <label className="input-label">Budget</label>
              <div className="select-wrapper">
                <select
                  className="select"
                  value={config.budget}
                  onChange={(e) => handleConfigChange('budget', e.target.value)}
                >
                  {BUDGET_RANGES.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="input-section" style={{ marginTop: 'var(--spacing-lg)' }}>
              <label className="input-label">Room Size</label>
              <div className="select-wrapper">
                <select
                  className="select"
                  value={config.size}
                  onChange={(e) => handleConfigChange('size', e.target.value)}
                >
                  {ROOM_SIZES.map((size) => (
                    <option key={size.value} value={size.label}>{size.label}</option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{ 
                width: '100%', 
                marginTop: 'var(--spacing-xl)',
                padding: 'var(--spacing-md) var(--spacing-lg)'
              }}
            >
              {isGenerating ? (
                <>
                  <span className="loading-spinner" style={{ width: '20px', height: '20px' }}></span>
                  Generating...
                </>
              ) : (
                '✨ Generate Designs'
              )}
            </button>

            {isGenerating && (
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getLoadingProgress()}%` }}
                  ></div>
                </div>
                <p className="loading-text" style={{ marginTop: 'var(--spacing-sm)', textAlign: 'center' }}>
                  {Math.round(getLoadingProgress())}% Complete
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Results Panel */}
        <section className="results-panel">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!result && !isGenerating && !error && (
            <div className="card results-placeholder">
              <div className="results-placeholder-icon">🏠</div>
              <h3>Ready to Design</h3>
              <p>Configure your room settings and click "Generate Designs" to see AI-powered interior design suggestions.</p>
            </div>
          )}

          {result && (
            <>
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'image' ? 'active' : ''}`}
                  onClick={() => setActiveTab('image')}
                >
                  Room Visualization
                </button>
                <button
                  className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Design Description
                </button>
                <button
                  className={`tab ${activeTab === 'colors' ? 'active' : ''}`}
                  onClick={() => setActiveTab('colors')}
                >
                  Color Palette
                </button>
                <button
                  className={`tab ${activeTab === 'furniture' ? 'active' : ''}`}
                  onClick={() => setActiveTab('furniture')}
                >
                  Furniture
                </button>
              </div>

              <div className="card tab-content">
                {activeTab === 'image' && (
                  <div className="image-result">
                    {result.imageUrl ? (
                      <div className="image-container">
                        <img src={result.imageUrl} alt="Generated room design" />
                      </div>
                    ) : (
                      <div className="image-container">
                        <div className="image-placeholder">
                          <span style={{ fontSize: '48px' }}>🎨</span>
                          <p>Image generation is taking longer than expected</p>
                          <p style={{ fontSize: '14px', opacity: 0.7 }}>
                            Check back soon for your AI-generated visualization
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'description' && (
                  <div className="text-result">
                    {result.description ? (
                      result.description.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))
                    ) : (
                      <p>Design description will appear here...</p>
                    )}
                  </div>
                )}

                {activeTab === 'colors' && (
                  <div className="color-palette">
                    {result.colorPalette?.colors.map((color, i) => (
                      <div key={i} className="color-swatch">
                        <div 
                          className="color-box" 
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="color-name">{color.name}</span>
                        <span className="color-hex">{color.hex}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'furniture' && (
                  <div className="furniture-list">
                    {result.furniture.map((item, i) => (
                      <div key={i} className="furniture-item">
                        <div className="furniture-header">
                          <span className="furniture-name">{item.name}</span>
                          <span className="furniture-price">{item.price}</span>
                        </div>
                        <span className="furniture-category">{item.category}</span>
                        <p className="furniture-description">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Powered by <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">Hugging Face</a> Inference API</p>
        <p style={{ marginTop: 'var(--spacing-xs)', opacity: 0.6 }}>
          AI-generated content may not always be accurate. Please use as inspiration only.
        </p>
      </footer>
    </div>
  );
}

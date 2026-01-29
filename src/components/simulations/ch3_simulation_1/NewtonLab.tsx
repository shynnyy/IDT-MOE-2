import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  Button,
  IconButton,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Collapse,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Replay,
  Speed,
  ArrowBack,
  ArrowForward,
  Science,
  Lightbulb,
  Info,
  CheckCircle,
  Error,
  WarningAmber,
  Visibility,
  VisibilityOff,
  ExpandLess,
  ExpandMore,
  RestartAlt,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

/**
 * NEWTON'S 3RD LAW - INTERACTIVE SIMULATION
 * FIXED: Progressive nail penetration - nail actually goes deeper into wood
 */

// ==================== CONSTANTS ====================

const PHYSICS = {
  G: 150000, // Increased for visible forces in simulation
  EARTH_MASS_REAL: 5.97,
  MOON_MASS_REAL: 0.07342,
  DEFAULTS: {
    HAMMER_MASS: 2.0,
    SWING_VELOCITY: 5.0,
    CONTACT_DURATION: 0.01,
    EARTH_MASS: 5.97,
    MOON_MASS: 0.07342,
    DISTANCE: 250,
  }
};

// ==================== STYLED COMPONENTS ====================

const AppContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  background: '#FAFBFC',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

const Header = styled(Paper)({
  background: '#FFFFFF',
  borderBottom: '2px solid #E8EBF0',
  borderRadius: 0,
  boxShadow: 'none',
});

const Canvas = styled('canvas')({
  width: '100%',
  height: '100%',
  background: '#FFFFFF',
  cursor: 'default',
});

const ControlBar = styled(Paper)({
  background: '#FFFFFF',
  borderTop: '2px solid #E8EBF0',
  boxShadow: 'none',
  borderRadius: 0,
  flexShrink: 0,
  minHeight: 'fit-content',
});

const MetricCard = styled(Paper)({
  padding: '16px 20px',
  background: '#FFFFFF',
  border: '2px solid #E8EBF0',
  borderRadius: 12,
  minWidth: 160,
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#4A90E2',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.15)',
  },
});

const NavButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 64,
  height: 64,
  background: '#FFFFFF',
  border: '2px solid #E8EBF0',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  zIndex: 50,
  '&:hover': {
    background: '#F8F9FA',
    borderColor: '#4A90E2',
    transform: 'translateY(-50%) scale(1.05)',
  },
  '&:disabled': {
    background: '#F8F9FA',
    borderColor: '#E8EBF0',
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  transition: 'all 0.2s ease',
});

const InsightCard = styled(Paper)({
  position: 'absolute',
  padding: 24,
  background: '#FFFFFF',
  border: '2px solid #E8EBF0',
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  maxWidth: 360,
  zIndex: 40,
  transition: 'all 0.3s ease',
});

const ActionButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 32px',
  borderRadius: 10,
  fontSize: '0.9375rem',
  boxShadow: 'none',
  border: '2px solid',
  transition: 'all 0.2s ease',
});

const FormulaPanel = styled(Paper)({
  position: 'absolute',
  top: 24,
  right: 24,
  padding: 20,
  maxWidth: 320,
  background: 'rgba(255, 255, 255, 0.98)',
  border: '2px solid #E8EBF0',
  borderRadius: 12,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  zIndex: 10,
});

// ==================== INTERFACES ====================

interface SimulationProps {
  currentPage: number;
  onNavigate: (tab: number) => void;
}

// ==================== MAIN APP ====================

const NewtonLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <AppContainer>
      {/* Header */}
      <Header elevation={0}>
        <Box sx={{ px: 4, py: 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2.5}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2.5,
                  background: '#4A90E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Science sx={{ fontSize: 30, color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: '#1A202C', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Newton's Third Law Laboratory
                </Typography>
                <Typography variant="body2" sx={{ color: '#718096', fontWeight: 500 }}>
                  Interactive Physics Simulation Platform
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ color: '#718096', fontWeight: 600, mr: 1 }}>
                Example {activeTab + 1} of 2
              </Typography>
              
              <Chip
                label="Example 1: Contact Force (Hammer & Nail)"
                onClick={() => setActiveTab(0)}
                sx={{
                  background: activeTab === 0 ? '#4A90E2' : '#FFFFFF',
                  color: activeTab === 0 ? '#FFFFFF' : '#4A5568',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 3,
                  py: 3.5,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: activeTab === 0 ? '#4A90E2' : '#E8EBF0',
                  borderRadius: 2,
                  '&:hover': {
                    background: activeTab === 0 ? '#3A7BC8' : '#F8F9FA',
                    borderColor: activeTab === 0 ? '#3A7BC8' : '#4A90E2',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
              <Chip
                label="Example 2: Non-Contact Force (Earth & Moon)"
                onClick={() => setActiveTab(1)}
                sx={{
                  background: activeTab === 1 ? '#4A90E2' : '#FFFFFF',
                  color: activeTab === 1 ? '#FFFFFF' : '#4A5568',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 3,
                  py: 3.5,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: activeTab === 1 ? '#4A90E2' : '#E8EBF0',
                  borderRadius: 2,
                  '&:hover': {
                    background: activeTab === 1 ? '#3A7BC8' : '#F8F9FA',
                    borderColor: activeTab === 1 ? '#3A7BC8' : '#4A90E2',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
            </Stack>
          </Stack>
        </Box>
      </Header>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeTab === 0 && <HammerSimulation currentPage={0} onNavigate={setActiveTab} />}
        {activeTab === 1 && <EarthMoonSimulation currentPage={1} onNavigate={setActiveTab} />}
      </Box>
    </AppContainer>
  );
};

// ==================== HAMMER & NAIL SIMULATION ====================

const HammerSimulation: React.FC<SimulationProps> = ({ currentPage, onNavigate }) => {
  // State Management
  const [hammerMass, setHammerMass] = useState(PHYSICS.DEFAULTS.HAMMER_MASS);
  const [swingVelocity, setSwingVelocity] = useState(PHYSICS.DEFAULTS.SWING_VELOCITY);
  const [isStriking, setIsStriking] = useState(false);
  const [showVectors, setShowVectors] = useState(true);
  const [contactDuration, setContactDuration] = useState(PHYSICS.DEFAULTS.CONTACT_DURATION);
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [totalNailDepth, setTotalNailDepth] = useState(0);
  const [strikeCount, setStrikeCount] = useState(0);
  const [impactData, setImpactData] = useState({
    force: 0,
    active: false,
    nailDeformation: 0,
  });

  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const stateRef = useRef({
    hammerY: 80,
    hammerVelocity: 0,
    nailDepth: 0, // Current depth during animation
    phase: 'ready',
    time: 0,
    impactStartTime: 0,
  });

  const GROUND_Y = 400;
  const NAIL_INITIAL_Y = 320;
  const HAMMER_HEIGHT = 50;

  // Physics Calculations
  const calculateImpactForce = () => {
    const deceleration = swingVelocity / contactDuration;
    const force = hammerMass * deceleration;
    return Math.round(force);
  };

  const calculateNailDeformation = () => {
    const force = calculateImpactForce();
    return Math.min(40, force / 500);
  };

  // Drawing Functions
  const drawGround = (ctx: CanvasRenderingContext2D, width: number) => {
    const woodGradient = ctx.createLinearGradient(0, GROUND_Y, 0, GROUND_Y + 100);
    woodGradient.addColorStop(0, '#8B6F47');
    woodGradient.addColorStop(0.5, '#A0826D');
    woodGradient.addColorStop(1, '#7A5C3E');
    ctx.fillStyle = woodGradient;
    ctx.fillRect(0, GROUND_Y, width, 100);

    ctx.strokeStyle = 'rgba(139, 111, 71, 0.3)';
    ctx.lineWidth = 1.5;
    
    for (let i = -100; i < width + 100; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, GROUND_Y);
      ctx.lineTo(i + 100, GROUND_Y + 100);
      ctx.stroke();
    }

    ctx.strokeStyle = '#6D5D4B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(width, GROUND_Y);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(160, 130, 109, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 1);
    ctx.lineTo(width, GROUND_Y + 1);
    ctx.stroke();
  };

  // FIXED NAIL - Shows penetration INTO wood
  const drawNail = (ctx: CanvasRenderingContext2D, x: number, currentDepth: number) => {
    const nailWidth = 12;
    const nailTotalLength = 80;
    
    // Nail head position starts at NAIL_INITIAL_Y and moves DOWN as it penetrates
    const nailHeadY = NAIL_INITIAL_Y + currentDepth;
    
    // Part of nail that's still ABOVE the wood surface (GROUND_Y)
    const aboveGroundLength = Math.max(0, GROUND_Y - nailHeadY);
    
    // Part of nail that's INSIDE the wood (below GROUND_Y)
    const belowGroundLength = Math.max(0, Math.min(nailTotalLength, nailHeadY + nailTotalLength - GROUND_Y));
    
    const headWidth = 28;
    const headHeight = 10;

    // Draw nail shaft INSIDE wood (below ground surface) - darker/shadowed
    if (belowGroundLength > 0) {
      ctx.fillStyle = '#64748B';
      const belowStartY = Math.max(nailHeadY, GROUND_Y);
      ctx.fillRect(x - nailWidth / 2, belowStartY, nailWidth, belowGroundLength);
    }

    // Draw nail shaft ABOVE wood surface
    if (aboveGroundLength > 0) {
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(x - nailWidth / 2, nailHeadY + headHeight, nailWidth, aboveGroundLength);
      
      // Shine effect on visible part
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(x - nailWidth / 2 + 2, nailHeadY + headHeight + 5, 3, Math.max(0, aboveGroundLength - 10));
      
      // Shadow on visible part
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + nailWidth / 2 - 2, nailHeadY + headHeight + 5, 2, Math.max(0, aboveGroundLength - 10));
    }
    
    // Nail head - only draw if above ground
    if (nailHeadY < GROUND_Y) {
      ctx.fillStyle = '#64748B';
      ctx.fillRect(x - headWidth / 2, nailHeadY, headWidth, headHeight);
      
      // Label
      ctx.font = 'bold 11px Inter';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.fillText('Nail', x, nailHeadY - 8);
    }
    
    // Show depth if nail has penetrated
    if (currentDepth > 0) {
      ctx.font = 'bold 10px Inter';
      ctx.fillStyle = '#EF4444';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentDepth.toFixed(1)}mm deep`, x, Math.min(nailHeadY - 20, GROUND_Y - 10));
    }
  };

  const drawHammer = (ctx: CanvasRenderingContext2D, x: number, y: number, phase: string) => {
    const hammerWidth = 80;
    const handleWidth = 12;
    const handleLength = 100;

    const hammerGradient = ctx.createLinearGradient(x - hammerWidth / 2, y, x + hammerWidth / 2, y);
    hammerGradient.addColorStop(0, '#3A3F47');
    hammerGradient.addColorStop(0.5, '#475569');
    hammerGradient.addColorStop(1, '#3A3F47');
    ctx.fillStyle = hammerGradient;
    ctx.fillRect(x - hammerWidth / 2, y, hammerWidth, HAMMER_HEIGHT);
    
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.fillRect(x - hammerWidth / 2 + 5, y + 5, hammerWidth - 10, 12);
    
    const handleGradient = ctx.createLinearGradient(x - handleWidth / 2, y - handleLength, x + handleWidth / 2, y);
    handleGradient.addColorStop(0, '#D97706');
    handleGradient.addColorStop(0.5, '#F59E0B');
    handleGradient.addColorStop(1, '#D97706');
    ctx.fillStyle = handleGradient;
    ctx.fillRect(x - handleWidth / 2, y - handleLength, handleWidth, handleLength);
    
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const lineY = y - handleLength + 20 + i * 20;
      ctx.beginPath();
      ctx.moveTo(x - handleWidth / 2, lineY);
      ctx.lineTo(x + handleWidth / 2, lineY);
      ctx.stroke();
    }
    
    ctx.font = 'bold 11px Inter';
    ctx.fillStyle = '#1F2937';
    ctx.textAlign = 'center';
    ctx.fillText('Hammer', x, y - handleLength - 10);
    ctx.fillText(`${hammerMass} kg`, x, y - handleLength - 24);

    if (phase === 'swinging') {
      ctx.fillStyle = 'rgba(71, 85, 105, 0.15)';
      ctx.fillRect(x - hammerWidth / 2, y - 15, hammerWidth, HAMMER_HEIGHT + 15);
    }
  };

  const drawForceVector = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    length: number,
    direction: 'up' | 'down',
    color: string,
    label: string
  ) => {
    const arrowHeadSize = 12;
    const directionMultiplier = direction === 'down' ? 1 : -1;

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + length * directionMultiplier);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    const headY = y + length * directionMultiplier;
    ctx.moveTo(x, headY);
    ctx.lineTo(x - arrowHeadSize, headY - arrowHeadSize * directionMultiplier);
    ctx.lineTo(x + arrowHeadSize, headY - arrowHeadSize * directionMultiplier);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 14px Inter';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 40, y + (length / 2) * directionMultiplier);
  };

  const drawContactEffect = (ctx: CanvasRenderingContext2D, x: number, y: number, intensity: number) => {
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 - i * 0.12})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, 20 + i * 15 * intensity, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.fillStyle = '#FCD34D';
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const sparkX = x + Math.cos(angle) * 30 * intensity;
      const sparkY = y + Math.sin(angle) * 30 * intensity;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Animation Loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const state = stateRef.current;

    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, width, height);
    drawGround(ctx, width);

    const centerX = width / 2;
    const nailX = centerX;
    const hammerX = centerX;

    if (isStriking) {
      state.time += 1 / 60;

      switch (state.phase) {
        case 'swinging':
          state.hammerVelocity += 9.8 / 60 + swingVelocity / 10;
          state.hammerY += state.hammerVelocity;

          // Check collision - hammer hits nail head
          const nailHeadY = NAIL_INITIAL_Y + totalNailDepth;
          if (state.hammerY + HAMMER_HEIGHT >= nailHeadY - 5) {
            state.phase = 'contact';
            state.impactStartTime = state.time;
            state.nailDepth = totalNailDepth; // Start from current total depth
            const force = calculateImpactForce();
            const deformation = calculateNailDeformation();
            setImpactData({ force, active: true, nailDeformation: deformation });
          }
          break;

        case 'contact':
          const contactProgress = (state.time - state.impactStartTime) / contactDuration;
          
          if (contactProgress < 1) {
            const maxDeformation = calculateNailDeformation();
            // Nail penetrates deeper during contact
            state.nailDepth = totalNailDepth + maxDeformation * contactProgress;
            
            // Hammer follows nail down
            const nailHeadY = NAIL_INITIAL_Y + state.nailDepth;
            state.hammerY = nailHeadY - HAMMER_HEIGHT;
          } else {
            state.phase = 'rebound';
            // Lock in the new depth
            const finalDepth = totalNailDepth + calculateNailDeformation();
            setTotalNailDepth(finalDepth);
            setStrikeCount(prev => prev + 1);
            state.nailDepth = finalDepth;
          }
          break;

        case 'rebound':
          state.hammerVelocity = -swingVelocity * 0.3;
          state.hammerY += state.hammerVelocity;

          if (state.hammerY <= 80) {
            state.phase = 'complete';
            setIsStriking(false);
            setImpactData(prev => ({ ...prev, active: false }));
          }
          break;
      }
    }

    // Draw nail at current depth
    const displayDepth = isStriking && state.phase !== 'ready' ? state.nailDepth : totalNailDepth;
    drawNail(ctx, nailX, displayDepth);
    drawHammer(ctx, hammerX, state.hammerY, state.phase);

    if (showVectors && state.phase === 'contact' && impactData.active) {
      const forceLength = Math.min(100, impactData.force / 50);
      const nailHeadY = NAIL_INITIAL_Y + state.nailDepth;
      
      drawForceVector(ctx, nailX + 50, nailHeadY, forceLength, 'down', '#EF4444', 'F_on_nail');
      drawForceVector(ctx, hammerX - 50, state.hammerY + HAMMER_HEIGHT, forceLength, 'up', '#4A90E2', 'F_on_hammer');
      drawContactEffect(ctx, nailX, nailHeadY, impactData.force / 2000);

      ctx.font = 'bold 24px Inter';
      ctx.fillStyle = '#10B981';
      ctx.textAlign = 'center';
      ctx.fillText('=', centerX, nailHeadY + 60);
    }

    if (state.phase === 'swinging') {
      ctx.font = 'bold 13px Inter';
      ctx.fillStyle = '#DC2626';
      ctx.textAlign = 'center';
      ctx.fillText(`v = ${state.hammerVelocity.toFixed(1)} m/s`, hammerX, state.hammerY - 10);
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hammerX - 30, state.hammerY - 20);
      ctx.lineTo(hammerX - 30, state.hammerY - 20 + state.hammerVelocity * 3);
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isStriking, showVectors, swingVelocity, hammerMass, contactDuration, impactData, totalNailDepth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentPage < 1) {
        onNavigate(currentPage + 1);
      }
      if (e.key === ' ' && !isStriking) {
        e.preventDefault();
        handleStrike();
      }
      if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, isStriking, onNavigate]);

  // Control Functions
  const handleStrike = () => {
    if (isStriking) return;
    
    setIsStriking(true);
    stateRef.current = {
      hammerY: 80,
      hammerVelocity: 0,
      nailDepth: totalNailDepth,
      phase: 'swinging',
      time: 0,
      impactStartTime: 0,
    };
    setImpactData({ force: 0, active: false, nailDeformation: 0 });
  };

  const handleReset = () => {
    setIsStriking(false);
    setTotalNailDepth(0);
    setStrikeCount(0);
    stateRef.current = {
      hammerY: 80,
      hammerVelocity: 0,
      nailDepth: 0,
      phase: 'ready',
      time: 0,
      impactStartTime: 0,
    };
    setImpactData({ force: 0, active: false, nailDeformation: 0 });
  };

  const handleResetDefaults = () => {
    setHammerMass(PHYSICS.DEFAULTS.HAMMER_MASS);
    setSwingVelocity(PHYSICS.DEFAULTS.SWING_VELOCITY);
    setContactDuration(PHYSICS.DEFAULTS.CONTACT_DURATION);
    handleReset();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Canvas Area */}
      <Box sx={{ flex: 1, position: 'relative', background: '#F8F9FA', minHeight: 0 }}>
        <Tooltip title="No previous example (or press ← key)">
          <span>
            <NavButton disabled sx={{ left: 24 }}>
              <ArrowBack sx={{ color: '#CBD5E0' }} />
            </NavButton>
          </span>
        </Tooltip>

        <Tooltip title="Next: Earth & Moon (or press → key)">
          <NavButton onClick={() => onNavigate(1)} sx={{ right: 24 }}>
            <ArrowForward sx={{ color: '#4A90E2' }} />
          </NavButton>
        </Tooltip>

        {/* Data Metrics */}
        <Stack direction="row" spacing={2} sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
          <MetricCard>
            <Typography
              variant="caption"
              sx={{ color: '#718096', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}
              gutterBottom
            >
              Force on Nail (Action)
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#EF4444' }}>
                {impactData.active ? impactData.force : '--'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096', fontWeight: 600 }}>
                N
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#A0AEC0' }}>
              F = ma (downward)
            </Typography>
          </MetricCard>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              background: '#F0FDF4',
              border: '2px solid #86EFAC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#10B981' }}>
              =
            </Typography>
          </Box>

          <MetricCard>
            <Typography
              variant="caption"
              sx={{ color: '#718096', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}
              gutterBottom
            >
              Force on Hammer (Reaction)
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#4A90E2' }}>
                {impactData.active ? impactData.force : '--'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096', fontWeight: 600 }}>
                N
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#A0AEC0' }}>
              F = ma (upward)
            </Typography>
          </MetricCard>

          {/* Nail Depth Display */}
          {totalNailDepth > 0 && (
            <MetricCard sx={{ 
              background: '#FEF3C7', 
              borderColor: '#FCD34D' 
            }}>
              <Typography
                variant="caption"
                sx={{ 
                  color: '#92400E', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px' 
                }}
                gutterBottom
              >
                Nail Penetration
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={0.5}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: '#D97706' 
                }}>
                  {totalNailDepth.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#B45309', fontWeight: 600 }}>
                  mm
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ 
                color: '#B45309' 
              }}>
                Into wood surface
              </Typography>
            </MetricCard>
          )}
        </Stack>

        {/* Real-time Explanation Panel - Always Visible */}
        <FormulaPanel>
          <Typography variant="caption" sx={{ color: '#718096', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
            📊 Live Parameter Analysis
          </Typography>
          <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#1A202C', lineHeight: 1.8 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
              <strong>Current Settings:</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              • Hammer mass: {hammerMass} kg
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              • Swing velocity: {swingVelocity} m/s
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem', mb: 1 }}>
              • Contact time: {(contactDuration * 1000).toFixed(1)} ms
            </Typography>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
              <strong>Newton's 2nd Law (F = ma):</strong>
            </Typography>
            <Typography variant="caption" sx={{ pl: 2, color: '#059669', display: 'block', mb: 1, fontStyle: 'italic', fontSize: '0.75rem' }}>
              When hammer stops during impact, it decelerates
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              Step 1: Calculate deceleration
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              a = Δv / Δt = {swingVelocity} m/s ÷ {contactDuration} s
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, fontWeight: 700, color: '#EF4444', mt: 0.5 }}>
              a = {(swingVelocity / contactDuration).toFixed(1)} m/s²
            </Typography>
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem', mt: 1 }}>
              Step 2: Calculate force needed to stop
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              F = m × a = {hammerMass} kg × {(swingVelocity / contactDuration).toFixed(1)} m/s²
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, fontWeight: 700, color: '#4A90E2', mt: 0.5 }}>
              F = {calculateImpactForce()} N
            </Typography>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
              <strong>Newton's 3rd Law:</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              • Hammer pushes nail with {calculateImpactForce()} N ↓
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              • Nail pushes hammer with {calculateImpactForce()} N ↑
            </Typography>
            <Typography variant="caption" sx={{ pl: 2, color: '#10B981', display: 'block', mt: 0.5, fontWeight: 600 }}>
              → Equal magnitude, opposite directions!
            </Typography>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
              <strong>Predicted Nail Penetration:</strong>
            </Typography>
            <Typography variant="caption" sx={{ pl: 2, color: '#718096', display: 'block', mb: 0.5, fontStyle: 'italic', fontSize: '0.75rem' }}>
              (Simplified model for wood resistance)
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              Depth ≈ Force / 500 (material constant)
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, fontWeight: 700, color: '#D97706', mt: 0.5 }}>
              Next strike: +{calculateNailDeformation().toFixed(1)} mm
            </Typography>
            {totalNailDepth > 0 && (
              <Typography variant="caption" sx={{ pl: 2, color: '#059669', display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                Total depth: {totalNailDepth.toFixed(1)} mm
              </Typography>
            )}
            
            {impactData.active && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Alert severity="error" sx={{ py: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    🔨 IMPACT! Both objects feel {impactData.force} N
                  </Typography>
                </Alert>
              </>
            )}
            
            {!impactData.active && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Alert severity="info" sx={{ py: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    💡 Adjust mass, velocity, or contact time to see force change
                  </Typography>
                </Alert>
              </>
            )}
          </Box>
        </FormulaPanel>

        {/* Key Insights Card */}
        <InsightCard 
          sx={{ 
            bottom: insightsExpanded ? 24 : 24,
            right: 24,
            height: insightsExpanded ? 'auto' : 60,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: insightsExpanded ? 2 : 0 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: '#FEF3C7',
                  border: '2px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lightbulb sx={{ color: '#D97706', fontSize: 22 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A202C' }}>
                Contact Forces
              </Typography>
            </Stack>
            <IconButton onClick={() => setInsightsExpanded(!insightsExpanded)} size="small">
              {insightsExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={insightsExpanded}>
            <Stack spacing={2}>
              <Alert 
                severity="success" 
                icon={<CheckCircle />}
                sx={{ 
                  background: '#F0FDF4', 
                  border: '2px solid #86EFAC',
                  '& .MuiAlert-icon': { color: '#10B981' }
                }}
              >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  ✓ Newton's 3rd Law - Action & Reaction
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • Both forces equal: {impactData.active ? impactData.force : '--'} N
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • Acting in opposite directions
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  • Not acting on the same object
                </Typography>
              </Alert>

              <Alert 
                severity="info" 
                icon={<Info />}
                sx={{ 
                  background: '#EFF6FF', 
                  border: '2px solid #93C5FD',
                  '& .MuiAlert-icon': { color: '#4A90E2' }
                }}
              >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Progressive Penetration
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • Each strike drives nail deeper into wood
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • Current depth: {totalNailDepth.toFixed(1)}mm
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#4A90E2' }}>
                  Keep striking to drive it deeper!
                </Typography>
              </Alert>

              {!isStriking && totalNailDepth === 0 && (
                <Alert 
                  severity="warning" 
                  icon={<WarningAmber />}
                  sx={{ 
                    background: '#FFFBEB', 
                    border: '2px solid #FCD34D',
                    '& .MuiAlert-icon': { color: '#F59E0B' }
                  }}
                >
                  <Typography variant="caption" fontWeight={600}>
                    Click "Strike Hammer" or press Space to begin
                  </Typography>
                </Alert>
              )}
            </Stack>
          </Collapse>
        </InsightCard>

        <Canvas ref={canvasRef} />
      </Box>

      {/* Control Panel */}
      <ControlBar elevation={0}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Action Buttons */}
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <ActionButton
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={handleStrike}
                disabled={isStriking}
                sx={{
                  background: '#4A90E2',
                  borderColor: '#4A90E2',
                  color: '#FFFFFF',
                  '&:hover': {
                    background: '#3A7BC8',
                    borderColor: '#3A7BC8',
                  },
                  '&:disabled': {
                    background: '#CBD5E0',
                    borderColor: '#CBD5E0',
                    color: '#FFFFFF',
                  },
                }}
              >
                Strike Hammer
              </ActionButton>

              <ActionButton
                variant="outlined"
                startIcon={<Replay />}
                onClick={handleReset}
                disabled={isStriking}
                sx={{
                  borderColor: '#E8EBF0',
                  color: '#4A5568',
                  '&:hover': {
                    borderColor: '#4A90E2',
                    background: '#F8F9FA',
                  },
                  '&:disabled': {
                    borderColor: '#E8EBF0',
                    color: '#A0AEC0',
                  },
                }}
              >
                Reset Animation
              </ActionButton>

              <Tooltip title="Restore default values: 2kg, 5m/s, 10ms">
                <ActionButton
                  variant="outlined"
                  startIcon={<RestartAlt />}
                  onClick={handleResetDefaults}
                  disabled={isStriking}
                  sx={{
                    borderColor: '#FDE68A',
                    color: '#D97706',
                    background: '#FFFBEB',
                    '&:hover': {
                      borderColor: '#D97706',
                      background: '#FEF3C7',
                    },
                    '&:disabled': {
                      borderColor: '#E8EBF0',
                      color: '#A0AEC0',
                      background: '#F8F9FA',
                    },
                  }}
                >
                  Reset to Defaults
                </ActionButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem />

              <FormControlLabel
                control={
                  <Switch
                    checked={showVectors}
                    onChange={(e) => setShowVectors(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4A90E2',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4A90E2',
                      },
                    }}
                  />
                }
                label={
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {showVectors ? <Visibility /> : <VisibilityOff />}
                    <Typography variant="body2" fontWeight={600}>
                      Force Vectors
                    </Typography>
                  </Stack>
                }
              />
            </Stack>

            <Divider />

            {/* Parameter Controls */}
            <Stack direction="row" spacing={5} alignItems="center" justifyContent="center">
              <Tooltip 
                title={isStriking ? "⚠️ Pause animation to adjust parameters" : "Adjust hammer mass"}
                arrow
              >
                <Box sx={{ width: 280, opacity: isStriking ? 0.5 : 1, pointerEvents: isStriking ? 'none' : 'auto' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight={700} color="#1A202C">
                      Hammer Mass
                    </Typography>
                    <Chip
                      label={`${hammerMass.toFixed(1)} kg`}
                      size="small"
                      sx={{
                        background: '#4A90E2',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        border: 'none',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={hammerMass}
                    onChange={(_, val) => setHammerMass(val as number)}
                    min={0.5}
                    max={5.0}
                    step={0.1}
                    disabled={isStriking}
                    marks={[
                      { value: 0.5, label: '0.5' },
                      { value: 2.5, label: '2.5' },
                      { value: 5.0, label: '5.0' },
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        background: '#4A90E2',
                        width: 22,
                        height: 22,
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.4)',
                      },
                      '& .MuiSlider-track': {
                        background: '#4A90E2',
                        border: 'none',
                        height: 6,
                      },
                      '& .MuiSlider-rail': {
                        background: '#E8EBF0',
                        height: 6,
                      },
                    }}
                  />
                </Box>
              </Tooltip>

              <Tooltip 
                title={isStriking ? "⚠️ Pause animation to adjust parameters" : "Adjust swing velocity"}
                arrow
              >
                <Box sx={{ width: 280, opacity: isStriking ? 0.5 : 1, pointerEvents: isStriking ? 'none' : 'auto' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight={700} color="#1A202C">
                      Swing Velocity
                    </Typography>
                    <Chip
                      label={`${swingVelocity.toFixed(1)} m/s`}
                      size="small"
                      sx={{
                        background: '#4A90E2',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        border: 'none',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={swingVelocity}
                    onChange={(_, val) => setSwingVelocity(val as number)}
                    min={1.0}
                    max={10.0}
                    step={0.1}
                    disabled={isStriking}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 5.5, label: '5.5' },
                      { value: 10, label: '10' },
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        background: '#4A90E2',
                        width: 22,
                        height: 22,
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.4)',
                      },
                      '& .MuiSlider-track': {
                        background: '#4A90E2',
                        border: 'none',
                        height: 6,
                      },
                      '& .MuiSlider-rail': {
                        background: '#E8EBF0',
                        height: 6,
                      },
                    }}
                  />
                </Box>
              </Tooltip>

              <Tooltip 
                title={isStriking ? "⚠️ Pause animation to adjust parameters" : "Shorter duration = higher force"}
                arrow
              >
                <Box sx={{ width: 280, opacity: isStriking ? 0.5 : 1, pointerEvents: isStriking ? 'none' : 'auto' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight={700} color="#1A202C">
                      Contact Duration
                    </Typography>
                    <Chip
                      label={`${(contactDuration * 1000).toFixed(1)} ms`}
                      size="small"
                      sx={{
                        background: '#4A90E2',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        border: 'none',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={contactDuration * 1000}
                    onChange={(_, val) => setContactDuration((val as number) / 1000)}
                    min={5}
                    max={50}
                    step={1}
                    disabled={isStriking}
                    marks={[
                      { value: 5, label: '5ms' },
                      { value: 27.5, label: '27.5ms' },
                      { value: 50, label: '50ms' },
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        background: '#4A90E2',
                        width: 22,
                        height: 22,
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.4)',
                      },
                      '& .MuiSlider-track': {
                        background: '#4A90E2',
                        border: 'none',
                        height: 6,
                      },
                      '& .MuiSlider-rail': {
                        background: '#E8EBF0',
                        height: 6,
                      },
                    }}
                  />
                </Box>
              </Tooltip>
            </Stack>

            {/* Keyboard Shortcuts Hint */}
            <Typography variant="caption" sx={{ textAlign: 'center', color: '#A0AEC0', fontStyle: 'italic' }}>
              💡 Keyboard shortcuts: Space = Strike | R = Reset | → = Next Example
            </Typography>
          </Stack>
        </Box>
      </ControlBar>
    </Box>
  );
};

// ==================== EARTH & MOON SIMULATION ====================
// [Same as original - keeping it unchanged]

const EarthMoonSimulation: React.FC<SimulationProps> = ({ currentPage, onNavigate }) => {
  const [earthMass, setEarthMass] = useState(PHYSICS.DEFAULTS.EARTH_MASS);
  const [moonMass, setMoonMass] = useState(PHYSICS.DEFAULTS.MOON_MASS);
  const [distance, setDistance] = useState(PHYSICS.DEFAULTS.DISTANCE);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showVectors, setShowVectors] = useState(true);
  const [showTrail, setShowTrail] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [viewMode, setViewMode] = useState<'normal' | 'center-of-mass'>('normal');
  const [showMisconception, setShowMisconception] = useState(false);
  const [insightsExpanded, setInsightsExpanded] = useState(true);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const angleRef = useRef(0);
  const trailPoints = useRef([]);

  const calculateForce = () => {
    return Math.round((PHYSICS.G * earthMass * moonMass) / Math.pow(distance, 2));
  };

  const calculateAcceleration = (mass: number) => {
    const force = calculateForce();
    return (force / mass).toFixed(2);
  };

  const getMassRatio = () => {
    return (earthMass / moonMass).toFixed(1);
  };

  const getAccelerationRatio = () => {
    return (parseFloat(calculateAcceleration(moonMass)) / parseFloat(calculateAcceleration(earthMass))).toFixed(1);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#E8EBF0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  const drawCenterOfMass = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    const comOffset = (moonMass * distance) / (earthMass + moonMass);
    const comX = centerX + comOffset;

    ctx.beginPath();
    ctx.fillStyle = '#EF4444';
    ctx.arc(comX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(comX, centerY - 30);
    ctx.lineTo(comX, centerY + 30);
    ctx.moveTo(comX - 30, centerY);
    ctx.lineTo(comX + 30, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = 'bold 12px Inter';
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'center';
    ctx.fillText('Center of Mass', comX, centerY - 40);
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    length: number,
    angle: number,
    color: string,
    label: string
  ) => {
    const toX = fromX + Math.cos(angle) * length;
    const toY = fromY + Math.sin(angle) * length;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    const headLength = 14;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 13px Inter';
    const metrics = ctx.measureText(label);
    const labelX = toX + Math.cos(angle) * 25;
    const labelY = toY + Math.sin(angle) * 25;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(labelX - metrics.width / 2 - 4, labelY - 10, metrics.width + 8, 20);
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(label, labelX, labelY + 4);
  };

  const drawTrail = (ctx: CanvasRenderingContext2D) => {
    if (trailPoints.current.length < 2) return;

    const gradient = ctx.createLinearGradient(
      trailPoints.current[0].x,
      trailPoints.current[0].y,
      trailPoints.current[trailPoints.current.length - 1].x,
      trailPoints.current[trailPoints.current.length - 1].y
    );
    gradient.addColorStop(0, 'rgba(203, 213, 224, 0.1)');
    gradient.addColorStop(1, 'rgba(203, 213, 224, 0.4)');

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.setLineDash([2, 2]);

    trailPoints.current.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.stroke();
    ctx.setLineDash([]);
  };

  const draw = useCallback(
    (ctx) => {
      const { width, height } = ctx.canvas;
      const centerX = width / 2;
      const centerY = height / 2;

      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2);
      bgGradient.addColorStop(0, '#1A202C');
      bgGradient.addColorStop(1, '#0F1419');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 100; i++) {
        const x = (i * 137.5) % width;
        const y = (i * 449.3) % height;
        const size = (i % 3) * 0.5 + 0.5;
        ctx.globalAlpha = 0.3 + (i % 7) * 0.1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (showGrid) {
        drawGrid(ctx, width, height);
      }

      if (isPlaying) {
        angleRef.current += 0.008 * animationSpeed * (100 / distance);
      }

      const earthRadius = 25 + earthMass * 2.5;
      const moonRadius = 12 + moonMass * 3;

      let earthX = centerX;
      let earthY = centerY;

      const moonX = centerX + Math.cos(angleRef.current) * distance;
      const moonY = centerY + Math.sin(angleRef.current) * distance;

      if (viewMode === 'center-of-mass') {
        const comOffset = (moonMass * distance) / (earthMass + moonMass);
        earthX = centerX + comOffset - Math.cos(angleRef.current) * comOffset;
        earthY = centerY - Math.sin(angleRef.current) * comOffset;
        drawCenterOfMass(ctx, centerX, centerY);
      }

      ctx.beginPath();
      ctx.strokeStyle = '#4A5568';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.arc(centerX, centerY, distance, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (showTrail) {
        trailPoints.current.push({ x: moonX, y: moonY });
        if (trailPoints.current.length > 150) {
          trailPoints.current.shift();
        }
        drawTrail(ctx);
      }

      ctx.beginPath();
      ctx.strokeStyle = '#718096';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.moveTo(earthX, earthY);
      ctx.lineTo(moonX, moonY);
      ctx.stroke();
      ctx.setLineDash([]);

      const midX = (earthX + moonX) / 2;
      const midY = (earthY + moonY) / 2;
      ctx.font = 'bold 11px Inter';
      ctx.fillStyle = '#CBD5E0';
      ctx.textAlign = 'center';
      ctx.fillText(`r = ${distance} units`, midX, midY - 10);

      if (showVectors) {
        const force = calculateForce();
        const arrowLength = Math.min(90, force / 12);

        const angleToEarth = Math.atan2(earthY - moonY, earthX - moonX);
        drawArrow(ctx, moonX, moonY, arrowLength, angleToEarth, '#EF4444', 'F_E');

        const angleToMoon = Math.atan2(moonY - earthY, moonX - earthX);
        drawArrow(ctx, earthX, earthY, arrowLength, angleToMoon, '#4A90E2', 'F_M');

        const equalX = (moonX + earthX) / 2;
        const equalY = (moonY + earthY) / 2 + 50;
        
        ctx.fillStyle = '#10B981';
        ctx.fillRect(equalX - 20, equalY - 14, 40, 28);
        
        ctx.font = 'bold 24px Inter';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('=', equalX, equalY + 6);
      }

      ctx.save();
      const earthGradient = ctx.createRadialGradient(earthX, earthY, 0, earthX, earthY, earthRadius);
      earthGradient.addColorStop(0, '#60A5FA');
      earthGradient.addColorStop(0.7, '#3B82F6');
      earthGradient.addColorStop(1, '#2563EB');
      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#BFDBFE';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px Inter';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText('Earth', earthX, earthY + 4);
      ctx.shadowBlur = 0;
      ctx.restore();

      ctx.save();
      const moonGradient = ctx.createRadialGradient(moonX - moonRadius / 3, moonY - moonRadius / 3, 0, moonX, moonY, moonRadius);
      moonGradient.addColorStop(0, '#F1F5F9');
      moonGradient.addColorStop(0.5, '#CBD5E0');
      moonGradient.addColorStop(1, '#94A3B8');
      ctx.fillStyle = moonGradient;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#1A202C';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 3;
      ctx.fillText('Moon', moonX, moonY + 3);
      ctx.shadowBlur = 0;
      ctx.restore();
    },
    [earthMass, moonMass, distance, isPlaying, animationSpeed, showVectors, showTrail, showGrid, viewMode]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const animate = () => {
      draw(ctx);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  useEffect(() => {
    trailPoints.current = [];
  }, [earthMass, moonMass, distance]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        onNavigate(currentPage - 1);
      }
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
      if (e.key === 'r' || e.key === 'R') {
        angleRef.current = 0;
        trailPoints.current = [];
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, isPlaying, onNavigate]);

  const handleResetDefaults = () => {
    setEarthMass(PHYSICS.DEFAULTS.EARTH_MASS);
    setMoonMass(PHYSICS.DEFAULTS.MOON_MASS);
    setDistance(PHYSICS.DEFAULTS.DISTANCE);
    angleRef.current = 0;
    trailPoints.current = [];
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, position: 'relative', background: '#0F1419', minHeight: 0 }}>
        <Tooltip title="Previous: Hammer & Nail (or press ← key)">
          <NavButton onClick={() => onNavigate(0)} sx={{ left: 24 }}>
            <ArrowBack sx={{ color: '#4A90E2' }} />
          </NavButton>
        </Tooltip>

        <Tooltip title="No next example">
          <span>
            <NavButton disabled sx={{ right: 24 }}>
              <ArrowForward sx={{ color: '#CBD5E0' }} />
            </NavButton>
          </span>
        </Tooltip>

        <Stack direction="row" spacing={2} sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}>
          <MetricCard sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <Typography
              variant="caption"
              sx={{ color: '#718096', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}
              gutterBottom
            >
              Gravitational Force
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#4A90E2' }}>
                {calculateForce()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096', fontWeight: 600 }}>
                N
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#A0AEC0' }}>
              F = G(m₁m₂)/r²
            </Typography>
          </MetricCard>

          <MetricCard sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <Typography
              variant="caption"
              sx={{ color: '#718096', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}
              gutterBottom
            >
              Moon Acceleration
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#EF4444' }}>
                {calculateAcceleration(moonMass)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096', fontWeight: 600 }}>
                m/s²
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#A0AEC0' }}>
              a_M = F/m_M (larger!)
            </Typography>
          </MetricCard>

          <MetricCard sx={{ background: 'rgba(255, 255, 255, 0.95)' }}>
            <Typography
              variant="caption"
              sx={{ color: '#718096', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}
              gutterBottom
            >
              Earth Acceleration
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#4A90E2' }}>
                {calculateAcceleration(earthMass)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096', fontWeight: 600 }}>
                m/s²
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: '#A0AEC0' }}>
              a_E = F/m_E (smaller!)
            </Typography>
          </MetricCard>
        </Stack>

        {/* Real-time Explanation Panel */}
        <FormulaPanel>
          <Typography variant="caption" sx={{ color: '#718096', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
            📊 Live Calculations
          </Typography>
          <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#1A202C', lineHeight: 1.8 }}>
            <Alert severity="info" sx={{ mb: 1.5, py: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                ℹ️ Note: G constant is scaled for visualization. Real value: 6.674×10⁻¹¹
              </Typography>
            </Alert>
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
              <strong>Newton's Law of Gravitation:</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              F = G × (m₁ × m₂) / r²
            </Typography>
            <Typography variant="caption" sx={{ pl: 2, color: '#059669', display: 'block', mb: 1, fontStyle: 'italic', fontSize: '0.75rem' }}>
              Every mass attracts every other mass
            </Typography>
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              F = 150,000 × ({earthMass.toFixed(2)} × {moonMass.toFixed(5)}) / {distance}²
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              F = 150,000 × {(earthMass * moonMass).toFixed(5)} / {(distance * distance).toFixed(0)}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, fontWeight: 700, color: '#4A90E2', mt: 0.5 }}>
              F = {calculateForce()} N
            </Typography>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
              <strong>Newton's 3rd Law:</strong>
            </Typography>
            <Typography variant="caption" sx={{ pl: 2, color: '#059669', display: 'block', mb: 1, fontStyle: 'italic', fontSize: '0.75rem' }}>
              For every action, there's an equal and opposite reaction
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              • Earth pulls Moon: {calculateForce()} N →
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              • Moon pulls Earth: {calculateForce()} N ←
            </Typography>
            <Typography variant="caption" sx={{ pl: 2, color: '#10B981', display: 'block', mt: 0.5, fontWeight: 600 }}>
              → Same force, opposite directions!
            </Typography>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
              <strong>Newton's 2nd Law (F = ma):</strong>
            </Typography>
            <Typography variant="caption" sx={{ pl: 2, color: '#718096', display: 'block', mb: 0.5, fontStyle: 'italic', fontSize: '0.75rem' }}>
              Same force → Different accelerations!
            </Typography>
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem', mt: 0.5 }}>
              Moon: a = F / m
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              a_Moon = {calculateForce()} N / {moonMass.toFixed(5)} kg
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, fontWeight: 700, color: '#EF4444', mt: 0.5 }}>
              a_Moon = {calculateAcceleration(moonMass)} m/s²
            </Typography>
            <Typography variant="caption" sx={{ pl: 2, color: '#059669', display: 'block', mt: 0.5, fontStyle: 'italic' }}>
              ↑ Larger! (smaller mass = bigger acceleration)
            </Typography>
            
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem', mt: 1 }}>
              Earth: a = F / m
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, color: '#4A5568', fontSize: '0.8125rem' }}>
              a_Earth = {calculateForce()} N / {earthMass.toFixed(2)} kg
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', pl: 2, fontWeight: 700, color: '#4A90E2', mt: 0.5 }}>
              a_Earth = {calculateAcceleration(earthMass)} m/s²
            </Typography>
            <Typography variant="caption" sx={{ pl: 2, color: '#059669', display: 'block', mt: 0.5, fontStyle: 'italic' }}>
              ↓ Smaller! (larger mass = smaller acceleration)
            </Typography>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#10B981', display: 'block' }}>
              📚 Key Insight:
            </Typography>
            <Typography variant="caption" sx={{ color: '#4A5568', display: 'block', mt: 0.5 }}>
              Both objects feel the same {calculateForce()} N force, but Moon accelerates {getAccelerationRatio()}× more than Earth because it's lighter!
            </Typography>
            
            <Alert severity="success" sx={{ mt: 1.5, py: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                💡 Try changing mass or distance to see effects!
              </Typography>
            </Alert>
          </Box>
        </FormulaPanel>

        <InsightCard 
          sx={{ 
            bottom: 24,
            right: 24, 
            background: 'rgba(255, 255, 255, 0.98)',
            height: insightsExpanded ? 'auto' : 60,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: insightsExpanded ? 2 : 0 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: '#E0F2FE',
                  border: '2px solid #7DD3FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lightbulb sx={{ color: '#0284C7', fontSize: 22 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A202C' }}>
                Non-Contact Forces
              </Typography>
            </Stack>
            <IconButton onClick={() => setInsightsExpanded(!insightsExpanded)} size="small">
              {insightsExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={insightsExpanded}>
            <Stack spacing={2}>
              <Alert
                severity="success"
                icon={<CheckCircle />}
                sx={{
                  background: '#F0FDF4',
                  border: '2px solid #86EFAC',
                  '& .MuiAlert-icon': { color: '#10B981' },
                }}
              >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  ✓ Newton's 3rd Law - Equal Forces
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • F_on_Moon = F_on_Earth = {calculateForce()} N
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • Equal in magnitude
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • Acting in opposite directions
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  • Not acting on the same object
                </Typography>
              </Alert>

              <Alert
                severity="info"
                icon={<Info />}
                sx={{
                  background: '#EFF6FF',
                  border: '2px solid #93C5FD',
                  '& .MuiAlert-icon': { color: '#4A90E2' },
                }}
              >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  ⚠️ Accelerations are DIFFERENT
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • Mass ratio: {getMassRatio()}:1 (Earth:Moon)
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  • Acceleration ratio: 1:{getAccelerationRatio()} (Earth:Moon)
                </Typography>
              </Alert>

              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowMisconception(!showMisconception)}
                sx={{
                  textTransform: 'none',
                  borderColor: '#E8EBF0',
                  color: '#4A5568',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#4A90E2',
                    background: '#F8F9FA',
                  },
                }}
              >
                {showMisconception ? 'Hide' : 'Show'} Common Misconception
              </Button>

              <Collapse in={showMisconception}>
                <Alert
                  severity="warning"
                  icon={<Error />}
                  sx={{
                    background: '#FFFBEB',
                    border: '2px solid #FCD34D',
                    '& .MuiAlert-icon': { color: '#F59E0B' },
                  }}
                >
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    ❌ Common Misconception
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                    "The bigger object exerts a stronger force"
                  </Typography>
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    ✅ Reality (Newton's 3rd Law)
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    Both forces are ALWAYS equal in magnitude! The difference is in acceleration: a = F/m
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Smaller mass → larger acceleration (Moon moves more)
                  </Typography>
                </Alert>
              </Collapse>
            </Stack>
          </Collapse>
        </InsightCard>

        <Canvas ref={canvasRef} />
      </Box>

      <ControlBar elevation={0}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <ActionButton
                variant="contained"
                startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                onClick={() => setIsPlaying(!isPlaying)}
                sx={{
                  background: '#4A90E2',
                  borderColor: '#4A90E2',
                  color: '#FFFFFF',
                  '&:hover': {
                    background: '#3A7BC8',
                    borderColor: '#3A7BC8',
                  },
                }}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </ActionButton>

              <ActionButton
                variant="outlined"
                startIcon={<Replay />}
                onClick={() => {
                  angleRef.current = 0;
                  trailPoints.current = [];
                }}
                sx={{
                  borderColor: '#E8EBF0',
                  color: '#4A5568',
                  '&:hover': {
                    borderColor: '#4A90E2',
                    background: '#F8F9FA',
                  },
                }}
              >
                Reset Animation
              </ActionButton>

              <Tooltip title="Restore default values: Real Earth & Moon masses">
                <ActionButton
                  variant="outlined"
                  startIcon={<RestartAlt />}
                  onClick={handleResetDefaults}
                  sx={{
                    borderColor: '#FDE68A',
                    color: '#D97706',
                    background: '#FFFBEB',
                    '&:hover': {
                      borderColor: '#D97706',
                      background: '#FEF3C7',
                    },
                  }}
                >
                  Reset to Defaults
                </ActionButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem />

              <Stack direction="row" spacing={1} alignItems="center">
                <Speed sx={{ color: '#718096' }} />
                <Slider
                  value={animationSpeed}
                  onChange={(_, val) => setAnimationSpeed(val as number)}
                  min={0.1}
                  max={3}
                  step={0.1}
                  sx={{
                    width: 120,
                    '& .MuiSlider-thumb': {
                      background: '#4A90E2',
                    },
                    '& .MuiSlider-track': {
                      background: '#4A90E2',
                    },
                  }}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${v}×`}
                />
                <Typography variant="caption" sx={{ minWidth: 35, color: '#718096', fontWeight: 600 }}>
                  {animationSpeed.toFixed(1)}×
                </Typography>
              </Stack>

              <Divider orientation="vertical" flexItem />

              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, val) => val && setViewMode(val)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#E8EBF0',
                    color: '#4A5568',
                    '&.Mui-selected': {
                      background: '#4A90E2',
                      color: '#FFFFFF',
                      borderColor: '#4A90E2',
                      '&:hover': {
                        background: '#3A7BC8',
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="normal">Normal View</ToggleButton>
                <ToggleButton value="center-of-mass">Center of Mass</ToggleButton>
              </ToggleButtonGroup>

              <Divider orientation="vertical" flexItem />

              <FormControlLabel
                control={
                  <Switch
                    checked={showVectors}
                    onChange={(e) => setShowVectors(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4A90E2',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4A90E2',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={600} color="#1A202C">
                    Force Vectors
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showTrail}
                    onChange={(e) => setShowTrail(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4A90E2',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4A90E2',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={600} color="#1A202C">
                    Orbital Trail
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4A90E2',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4A90E2',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={600} color="#1A202C">
                    Grid
                  </Typography>
                }
              />
            </Stack>

            <Divider />

            <Stack direction="row" spacing={5} alignItems="center" justifyContent="center">
              <Tooltip 
                title={isPlaying ? "⚠️ Pause animation to adjust parameters" : "Adjust Earth mass"}
                arrow
              >
                <Box sx={{ width: 280, opacity: isPlaying ? 0.5 : 1, pointerEvents: isPlaying ? 'none' : 'auto' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight={700} color="#1A202C">
                      Earth Mass
                    </Typography>
                    <Chip
                      label={`${earthMass.toFixed(2)} × 10²⁴ kg`}
                      size="small"
                      sx={{
                        background: '#4A90E2',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        border: 'none',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={earthMass}
                    onChange={(_, val) => setEarthMass(val as number)}
                    min={1}
                    max={10}
                    step={0.01}
                    disabled={isPlaying}
                    marks={[
                      { value: 5.97, label: 'Real' },
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        background: '#4A90E2',
                        width: 22,
                        height: 22,
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.4)',
                      },
                      '& .MuiSlider-track': {
                        background: '#4A90E2',
                        border: 'none',
                        height: 6,
                      },
                      '& .MuiSlider-rail': {
                        background: '#E8EBF0',
                        height: 6,
                      },
                    }}
                  />
                </Box>
              </Tooltip>

              <Tooltip 
                title={isPlaying ? "⚠️ Pause animation to adjust parameters" : "Adjust Moon mass"}
                arrow
              >
                <Box sx={{ width: 280, opacity: isPlaying ? 0.5 : 1, pointerEvents: isPlaying ? 'none' : 'auto' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight={700} color="#1A202C">
                      Moon Mass
                    </Typography>
                    <Chip
                      label={`${moonMass.toFixed(5)} × 10²⁴ kg`}
                      size="small"
                      sx={{
                        background: '#4A90E2',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        border: 'none',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={moonMass}
                    onChange={(_, val) => setMoonMass(val as number)}
                    min={0.01}
                    max={2}
                    step={0.00001}
                    disabled={isPlaying}
                    marks={[
                      { value: 0.07342, label: 'Real' },
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        background: '#4A90E2',
                        width: 22,
                        height: 22,
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.4)',
                      },
                      '& .MuiSlider-track': {
                        background: '#4A90E2',
                        border: 'none',
                        height: 6,
                      },
                      '& .MuiSlider-rail': {
                        background: '#E8EBF0',
                        height: 6,
                      },
                    }}
                  />
                </Box>
              </Tooltip>

              <Tooltip 
                title={isPlaying ? "⚠️ Pause animation to adjust parameters" : "Adjust distance"}
                arrow
              >
                <Box sx={{ width: 280, opacity: isPlaying ? 0.5 : 1, pointerEvents: isPlaying ? 'none' : 'auto' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight={700} color="#1A202C">
                      Distance (r)
                    </Typography>
                    <Chip
                      label={`${distance} units`}
                      size="small"
                      sx={{
                        background: '#4A90E2',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        border: 'none',
                      }}
                    />
                  </Stack>
                  <Slider
                    value={distance}
                    onChange={(_, val) => setDistance(val as number)}
                    min={150}
                    max={400}
                    disabled={isPlaying}
                    marks={[
                      { value: 150, label: '150' },
                      { value: 275, label: '275' },
                      { value: 400, label: '400' },
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        background: '#4A90E2',
                        width: 22,
                        height: 22,
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 2px 8px rgba(74, 144, 226, 0.4)',
                      },
                      '& .MuiSlider-track': {
                        background: '#4A90E2',
                        border: 'none',
                        height: 6,
                      },
                      '& .MuiSlider-rail': {
                        background: '#E8EBF0',
                        height: 6,
                      },
                    }}
                  />
                </Box>
              </Tooltip>
            </Stack>

            <Typography variant="caption" sx={{ textAlign: 'center', color: '#A0AEC0', fontStyle: 'italic' }}>
              💡 Keyboard shortcuts: Space = Play/Pause | R = Reset | ← = Previous Example
            </Typography>
          </Stack>
        </Box>
      </ControlBar>
    </Box>
  );
};

export default NewtonLab;
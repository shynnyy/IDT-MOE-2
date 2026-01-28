import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Slider,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Collapse,
  Alert,
  AppBar,
  Toolbar,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  Refresh,
  Info,
  Close,
  Science,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

/**
 * Newton's 3rd Law Interactive Simulation
 * Example 1: Hammer and Nail (Contact Force)
 * Example 2: Earth and Moon (Non-contact Force)
 */

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#FFFFFF',
  borderBottom: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
}));

const SimulationCanvas = styled('canvas')(({ theme }) => ({
  width: '100%',
  height: '100%',
  cursor: 'crosshair',
  borderRadius: theme.spacing(1),
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  border: '1px solid #E5E7EB',
  background: '#FFFFFF',
}));

const ControlPanel = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  overflowY: 'auto',
  background: '#FAF5FF',
  borderRight: '1px solid #E9D5FF',
  boxShadow: 'none',
}));

const DataMetricCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  width: 400,
  maxWidth: '90vw',
  zIndex: 1000,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  borderRadius: theme.spacing(1.5),
  border: '1px solid #E5E7EB',
  overflow: 'hidden',
  background: '#FFFFFF',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ height: '100%' }}>
      {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
    </div>
  );
};

const NewtonLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        background: '#F5F3FF',
      }}
    >
      {/* Header */}
      <StyledAppBar position="static" elevation={0}>
        <Toolbar sx={{ minHeight: 72, px: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                background: '#E0E7FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Science sx={{ fontSize: 24, color: '#6366F1' }} />
            </Box>
            <Box>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 600, color: '#111827', letterSpacing: '-0.025em' }}>
                Newton's Physics Laboratory
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 500 }}>
                Interactive Learning Platform
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 48,
              '& .MuiTab-root': { 
                color: '#6B7280', 
                minHeight: 48,
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  color: '#374151',
                }
              },
              '& .Mui-selected': { 
                color: '#6366F1',
              },
            }}
            TabIndicatorProps={{
              style: { 
                backgroundColor: '#6366F1',
                height: 2,
              },
            }}
          >
            <Tab label="Example 1: Contact Force" />
            <Tab label="Example 2: Non-contact Force" />
          </Tabs>
        </Toolbar>
      </StyledAppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <TabPanel value={activeTab} index={0}>
          <HammerSimulation />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <OrbitSimulation />
        </TabPanel>
      </Box>

      {/* Info Card */}
      <Collapse in={showInfo}>
        <InfoCard elevation={0}>
          <Box 
            sx={{ 
              p: 2.5, 
              background: '#F3F4F6',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  background: '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Info sx={{ fontSize: 20, color: '#6366F1' }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#111827' }}>
                  Key Concept
                </Typography>
                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                  Newton's Third Law
                </Typography>
              </Box>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => setShowInfo(false)}
              sx={{ 
                color: '#6B7280',
                '&:hover': { 
                  background: '#F3F4F6',
                  color: '#374151',
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                mb: 2,
                p: 2,
                background: '#EFF6FF',
                borderRadius: 1,
                border: '1px solid #DBEAFE',
              }}
            >
              <Typography variant="body2" fontWeight={500} color="#1E40AF">
                For every action, there is an equal and opposite reaction.
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {[
                'Forces always come in pairs',
                'Two forces are equal in magnitude',
                'Two forces act in opposite directions',
              ].map((text, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 1,
                    background: '#F9FAFB',
                    border: '1px solid #F3F4F6',
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#6366F1',
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="body2" color="#374151" fontWeight={400}>
                    {text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </InfoCard>
      </Collapse>

      {!showInfo && (
        <IconButton
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            background: '#6366F1',
            color: 'white',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            '&:hover': { 
              background: '#4F46E5',
              boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
            },
          }}
          onClick={() => setShowInfo(true)}
        >
          <Info />
        </IconButton>
      )}
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* SCENARIO 1: HAMMER SIMULATION                                              */
/* -------------------------------------------------------------------------- */

const HammerSimulation: React.FC = () => {
  const [mass, setMass] = useState(5);
  const [velocity, setVelocity] = useState(5);
  const [isStriking, setIsStriking] = useState(false);
  const [impactData, setImpactData] = useState({ force: 0, active: false });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const stateRef = useRef({
    hammerY: 100,
    nailY: 300,
    phase: 'idle',
    progress: 0,
    impactTimer: 0,
    targetNailY: 300,
  });

  const GROUND_Y = 350;
  const NAIL_HEAD_Y_INITIAL = 300;

  const calculateForce = () => Math.round(mass * velocity * 20);

  const handleStrike = () => {
    if (isStriking) return;
    setIsStriking(true);
    stateRef.current.phase = 'down';
    setImpactData({ force: 0, active: false });
  };

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsStriking(false);
    stateRef.current = {
      hammerY: 100,
      nailY: NAIL_HEAD_Y_INITIAL,
      phase: 'idle',
      progress: 0,
      impactTimer: 0,
      targetNailY: 300,
    };
    setImpactData({ force: 0, active: false });
    
    // Restart animation loop
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const render = () => {
      draw(ctx);
      animationRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    label: string
  ) => {
    const headlen = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.fill();

    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(label, toX + 15, (fromY + toY) / 2);
  };

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { width, height } = ctx.canvas;
      const state = stateRef.current;

      ctx.clearRect(0, 0, width, height);

      // Draw Ground
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, GROUND_Y, width, height - GROUND_Y);
      ctx.fillStyle = '#A0522D';
      for (let i = 0; i < width; i += 40) ctx.fillRect(i, GROUND_Y, 20, height - GROUND_Y);

      // Draw Nail
      const nailX = width / 2;
      const nailHeight = 60;
      const currentNailY = state.nailY;

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(nailX - 5, currentNailY, 10, nailHeight);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(nailX - 12, currentNailY, 24, 8);

      // Hammer Animation Logic
      let hammerY = state.hammerY;
      const targetY = currentNailY - 40;

      if (state.phase === 'down') {
        const speed = velocity * 2;
        state.hammerY += speed;
        if (state.hammerY >= targetY) {
          state.hammerY = targetY;
          state.phase = 'contact';
          state.impactTimer = 0;

          const forceVal = calculateForce();
          setImpactData({ force: forceVal, active: true });

          const depth = Math.min(30, forceVal / 50);
          state.targetNailY = Math.min(GROUND_Y - 10, state.nailY + depth);
        }
      } else if (state.phase === 'contact') {
        state.impactTimer++;

        if (state.nailY < state.targetNailY) {
          state.nailY += 2;
          state.hammerY += 2;
        }

        if (state.impactTimer > 40) {
          state.phase = 'up';
          setImpactData((prev) => ({ ...prev, active: false }));
        }
      } else if (state.phase === 'up') {
        state.hammerY -= 5;
        if (state.hammerY <= 100) {
          state.hammerY = 100;
          state.phase = 'idle';
          setIsStriking(false);
        }
      }

      hammerY = state.hammerY;

      // Draw Hammer
      ctx.fillStyle = '#475569';
      ctx.fillRect(nailX - 30, hammerY, 60, 40);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(nailX - 5, hammerY - 80, 10, 80);

      // Draw Forces
      if (state.phase === 'contact') {
        const forceMag = calculateForce();
        const arrowLength = Math.min(120, forceMag / 10);

        drawArrow(ctx, nailX + 40, currentNailY, nailX + 40, currentNailY + arrowLength, '#ef4444', 'F_H');
        drawArrow(ctx, nailX - 40, currentNailY, nailX - 40, currentNailY - arrowLength, '#3b82f6', 'F_N');
      }
    },
    [mass, velocity]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      draw(ctx);
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Control Panel */}
      <Box sx={{ width: 320 }}>
        <ControlPanel elevation={0}>
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#111827', mb: 0.5 }}>
              Controls
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
              Adjust parameters to observe force pairs
            </Typography>

            <Stack spacing={2.5}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={500} color="#374151">
                    Hammer Mass
                  </Typography>
                  <Chip 
                    label={`${mass} kg`} 
                    size="small" 
                    sx={{ 
                      background: '#E0E7FF',
                      color: '#6366F1',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      border: 'none',
                    }} 
                  />
                </Box>
                <Slider
                  value={mass}
                  onChange={(_e, val) => setMass(val as number)}
                  min={1}
                  max={10}
                  disabled={isStriking}
                  marks
                  valueLabelDisplay="auto"
                  sx={{
                    '& .MuiSlider-thumb': {
                      background: '#A78BFA',
                      width: 18,
                      height: 18,
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 6px rgba(167, 139, 250, 0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      background: '#A78BFA',
                      border: 'none',
                      height: 4,
                    },
                    '& .MuiSlider-rail': {
                      background: '#E9D5FF',
                      height: 4,
                    },
                    '& .MuiSlider-mark': {
                      background: '#DDD6FE',
                      width: 2,
                      height: 8,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={500} color="#374151">
                    Swing Speed
                  </Typography>
                  <Chip 
                    label={`${velocity} m/s`} 
                    size="small" 
                    sx={{ 
                      background: '#E0E7FF',
                      color: '#6366F1',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      border: 'none',
                    }} 
                  />
                </Box>
                <Slider
                  value={velocity}
                  onChange={(_e, val) => setVelocity(val as number)}
                  min={1}
                  max={10}
                  disabled={isStriking}
                  marks
                  valueLabelDisplay="auto"
                  sx={{
                    '& .MuiSlider-thumb': {
                      background: '#A78BFA',
                      width: 18,
                      height: 18,
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 6px rgba(167, 139, 250, 0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      background: '#A78BFA',
                      border: 'none',
                      height: 4,
                    },
                    '& .MuiSlider-rail': {
                      background: '#E9D5FF',
                      height: 4,
                    },
                    '& .MuiSlider-mark': {
                      background: '#DDD6FE',
                      width: 2,
                      height: 8,
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', pt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<PlayArrow />}
              onClick={handleStrike}
              disabled={isStriking}
              sx={{ 
                py: 1.5, 
                fontWeight: 600,
                fontSize: '0.875rem',
                background: '#A78BFA',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
                textTransform: 'none',
                '&:hover': {
                  background: '#8B5CF6',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                },
                '&:disabled': {
                  background: '#E9D5FF',
                  color: '#C4B5FD',
                },
                borderRadius: 1.5,
              }}
            >
              Strike
            </Button>
            <IconButton
              onClick={reset}
              disabled={isStriking}
              sx={{ 
                border: '1px solid #E9D5FF',
                borderRadius: 1.5,
                width: 48,
                '&:hover': {
                  background: '#F3E8FF',
                  borderColor: '#DDD6FE',
                },
                '&:disabled': {
                  opacity: 0.5,
                }
              }}
            >
              <Refresh sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </ControlPanel>
      </Box>

      {/* Canvas Area */}
      <Box sx={{ flexGrow: 1, position: 'relative', background: '#FEF3C7', p: 3 }}>
        {/* Data Display */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}
          alignItems="center"
        >
          <DataMetricCard sx={{ background: '#FFF7ED' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="#78350F" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.65rem' }} gutterBottom display="block">
                Force on Nail
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ color: '#DC2626', mb: 0.5 }}>
                {impactData.active ? impactData.force : '--'}
              </Typography>
              <Chip 
                label="Action" 
                size="small" 
                sx={{ 
                  background: '#FEE2E2',
                  color: '#991B1B',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 20,
                  border: 'none',
                }} 
              />
            </CardContent>
          </DataMetricCard>

          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              background: '#FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#78350F',
              fontWeight: 600,
              fontSize: '1.25rem',
            }}
          >
            =
          </Box>

          <DataMetricCard sx={{ background: '#DBEAFE' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="#1E3A8A" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.65rem' }} gutterBottom display="block">
                Force on Hammer
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ color: '#2563EB', mb: 0.5 }}>
                {impactData.active ? impactData.force : '--'}
              </Typography>
              <Chip 
                label="Reaction" 
                size="small" 
                sx={{ 
                  background: '#BFDBFE',
                  color: '#1E40AF',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 20,
                  border: 'none',
                }} 
              />
            </CardContent>
          </DataMetricCard>
        </Stack>

        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 2,
        }}>
          <SimulationCanvas ref={canvasRef} width={800} height={600} />
        </Box>

        {!isStriking && impactData.force === 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Alert 
              severity="info" 
              sx={{ 
                background: '#EFF6FF',
                color: '#1E40AF',
                border: '1px solid #BFDBFE',
                borderRadius: 1.5,
                '& .MuiAlert-icon': {
                  color: '#3B82F6',
                }
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                Click "Strike" to begin experiment
              </Typography>
            </Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* SCENARIO 2: ORBIT SIMULATION                                               */
/* -------------------------------------------------------------------------- */

const OrbitSimulation: React.FC = () => {
  const [earthMass, setEarthMass] = useState(5);
  const [moonMass, setMoonMass] = useState(2);
  const [distance, setDistance] = useState(200);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(0);

  const calculateGravity = () => {
    const G = 2000;
    return Math.round((G * earthMass * moonMass) / (distance * 0.5));
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    label: string
  ) => {
    const headlen = 12;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.fill();

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = color;
    ctx.fillText(label, toX + Math.cos(angle) * 20, toY + Math.sin(angle) * 20);
  };

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { width, height } = ctx.canvas;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      angleRef.current += 0.005 + (100 / distance) * 0.005;

      const earthRadius = 20 + earthMass * 4;
      const moonX = centerX + Math.cos(angleRef.current) * distance;
      const moonY = centerY + Math.sin(angleRef.current) * distance;
      const moonRadius = 10 + moonMass * 2;

      // Orbit Path
      ctx.beginPath();
      ctx.strokeStyle = '#e2e8f0';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.arc(centerX, centerY, distance, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Connection Line
      ctx.beginPath();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(moonX, moonY);
      ctx.stroke();

      // Forces
      const forceMag = calculateGravity();
      const arrowLength = Math.min(distance - earthRadius - moonRadius, forceMag / 5);

      const angleToEarth = Math.atan2(centerY - moonY, centerX - moonX);
      drawArrow(
        ctx,
        moonX,
        moonY,
        moonX + Math.cos(angleToEarth) * arrowLength,
        moonY + Math.sin(angleToEarth) * arrowLength,
        '#ef4444',
        'F_E'
      );

      const angleToMoon = Math.atan2(moonY - centerY, moonX - centerX);
      drawArrow(
        ctx,
        centerX,
        centerY,
        centerX + Math.cos(angleToMoon) * arrowLength,
        centerY + Math.sin(angleToMoon) * arrowLength,
        '#3b82f6',
        'F_M'
      );

      // Earth
      ctx.beginPath();
      ctx.fillStyle = '#3b82f6';
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Moon
      ctx.beginPath();
      ctx.fillStyle = '#94a3b8';
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();
    },
    [earthMass, moonMass, distance]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      draw(ctx);
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Control Panel */}
      <Box sx={{ width: 320 }}>
        <ControlPanel elevation={0}>
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#111827', mb: 0.5 }}>
              Gravity Controls
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
              Adjust mass and distance parameters
            </Typography>

            <Stack spacing={2.5}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={500} color="#374151">
                    Earth Mass (M₁)
                  </Typography>
                  <Chip 
                    label={earthMass} 
                    size="small" 
                    sx={{ 
                      background: '#E0E7FF',
                      color: '#6366F1',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      border: 'none',
                    }} 
                  />
                </Box>
                <Slider
                  value={earthMass}
                  onChange={(_e, val) => setEarthMass(val as number)}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                  sx={{
                    '& .MuiSlider-thumb': {
                      background: '#A78BFA',
                      width: 18,
                      height: 18,
                    },
                    '& .MuiSlider-track': {
                      background: '#A78BFA',
                      border: 'none',
                      height: 4,
                    },
                    '& .MuiSlider-rail': {
                      background: '#E9D5FF',
                      height: 4,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={500} color="#374151">
                    Moon Mass (M₂)
                  </Typography>
                  <Chip 
                    label={moonMass} 
                    size="small" 
                    sx={{ 
                      background: '#E0E7FF',
                      color: '#6366F1',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      border: 'none',
                    }} 
                  />
                </Box>
                <Slider
                  value={moonMass}
                  onChange={(_e, val) => setMoonMass(val as number)}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                  sx={{
                    '& .MuiSlider-thumb': {
                      background: '#A78BFA',
                      width: 18,
                      height: 18,
                    },
                    '& .MuiSlider-track': {
                      background: '#A78BFA',
                      border: 'none',
                      height: 4,
                    },
                    '& .MuiSlider-rail': {
                      background: '#E9D5FF',
                      height: 4,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={500} color="#374151">
                    Distance (r)
                  </Typography>
                  <Chip 
                    label={distance} 
                    size="small" 
                    sx={{ 
                      background: '#E0E7FF',
                      color: '#6366F1',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      border: 'none',
                    }} 
                  />
                </Box>
                <Slider
                  value={distance}
                  onChange={(_e, val) => setDistance(val as number)}
                  min={120}
                  max={350}
                  valueLabelDisplay="auto"
                  sx={{
                    '& .MuiSlider-thumb': {
                      background: '#A78BFA',
                      width: 18,
                      height: 18,
                    },
                    '& .MuiSlider-track': {
                      background: '#A78BFA',
                      border: 'none',
                      height: 4,
                    },
                    '& .MuiSlider-rail': {
                      background: '#E9D5FF',
                      height: 4,
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>

          <Box 
            sx={{ 
              p: 2,
              background: '#ECFDF5',
              borderRadius: 1.5,
              border: '1px solid #A7F3D0',
              mt: 'auto',
            }}
          >
            <Typography variant="caption" fontWeight={600} color="#065F46" gutterBottom display="block">
              Discovery
            </Typography>
            <Typography variant="caption" color="#047857" fontWeight={400} display="block" sx={{ lineHeight: 1.6 }}>
              Notice that even if the Earth is much bigger, the force arrows are exactly the same length!
            </Typography>
          </Box>
        </ControlPanel>
      </Box>

      {/* Canvas Area */}
      <Box
        sx={{
          flexGrow: 1,
          position: 'relative',
          background: '#1E293B',
          p: 3,
        }}
      >
        {/* Data Display */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }}
          alignItems="center"
        >
          <DataMetricCard sx={{ background: '#FFF7ED' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="#78350F" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.65rem' }} gutterBottom display="block">
                Force on Moon
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ color: '#DC2626', mb: 0.5 }}>
                {calculateGravity()}
              </Typography>
              <Chip 
                label="Action" 
                size="small" 
                sx={{ 
                  background: '#FEE2E2',
                  color: '#991B1B',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 20,
                  border: 'none',
                }} 
              />
            </CardContent>
          </DataMetricCard>

          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.25rem',
            }}
          >
            =
          </Box>

          <DataMetricCard sx={{ background: '#DBEAFE' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="#1E3A8A" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.65rem' }} gutterBottom display="block">
                Force on Earth
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ color: '#2563EB', mb: 0.5 }}>
                {calculateGravity()}
              </Typography>
              <Chip 
                label="Reaction" 
                size="small" 
                sx={{ 
                  background: '#BFDBFE',
                  color: '#1E40AF',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: 20,
                  border: 'none',
                }} 
              />
            </CardContent>
          </DataMetricCard>
        </Stack>

        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 2,
        }}>
          <SimulationCanvas ref={canvasRef} width={800} height={600} />
        </Box>

        <Chip
          label="Formula: F ∝ (m₁ × m₂) / r²"
          sx={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            background: '#FFF7ED',
            color: '#78350F',
            fontWeight: 500,
            fontSize: '0.8rem',
            border: '1px solid #FED7AA',
            py: 2,
            px: 2.5,
          }}
        />
      </Box>
    </Box>
  );
};

export default NewtonLab;
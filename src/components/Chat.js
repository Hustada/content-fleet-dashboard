import { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Avatar, Chip, Menu, MenuItem, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import StatusIndicator from './StatusIndicator';
import SoundEffects from '../utils/soundEffects';
import { useMission } from '../contexts/MissionContext';

// Command templates
const commands = [
  {
    label: 'Start Research',
    template: '/research {topic} --depth {depth} --sources {sources}'
  },
  {
    label: 'Generate Content',
    template: '/generate {type} --tone {tone} --length {length}'
  },
  {
    label: 'Optimize Content',
    template: '/optimize --target {target} --keywords {keywords}'
  },
  {
    label: 'Review Content',
    template: '/review --criteria {criteria}'
  }
];

// Simulated chat data
const initialMessages = [
  {
    id: 1,
    sender: 'Agent Smith',
    type: 'agent',
    content: 'Starting content research for AI trends article.',
    timestamp: '14:30',
    status: 'online'
  },
  {
    id: 2,
    sender: 'System',
    type: 'system',
    content: 'Research parameters set. Accessing databases...',
    timestamp: '14:31',
    category: 'info'
  },
  {
    id: 3,
    sender: 'Agent Smith',
    type: 'agent',
    content: 'Analysis complete. Found 50 relevant articles. Proceeding with content synthesis.',
    timestamp: '14:35',
    status: 'online'
  }
];

const agents = [
  { id: 1, name: 'Agent Smith', status: 'online' },
  { id: 2, name: 'Agent Johnson', status: 'busy' },
  { id: 3, name: 'Agent Brown', status: 'offline' }
];

function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const messagesEndRef = useRef(null);
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const { currentMission, updateMission } = useMission();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCommandClick = (command) => {
    setNewMessage(command.template);
    setAnchorEl(null);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    SoundEffects.click();
    
    // Check if it's a command
    const isCommand = newMessage.startsWith('/');
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'Commander',
      type: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate agent response
    setIsTyping(true);
    setTimeout(() => {
      const responseMessage = {
        id: messages.length + 2,
        sender: selectedAgent.name,
        type: 'agent',
        content: isCommand 
          ? `Processing command: ${newMessage}`
          : `Acknowledged. ${currentMission ? `Updating mission ${currentMission.id} with new information.` : 'No active mission selected.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: selectedAgent.status
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);
      
      // If there's an active mission, update its status
      if (currentMission && isCommand) {
        updateMission(currentMission.id, {
          status: 'in-progress',
          lastUpdate: new Date().toISOString()
        });
      }
    }, 1500);
  };

  const getMessageStyle = (type) => {
    switch(type) {
      case 'system':
        return {
          bgcolor: 'background.paper',
          borderLeft: '4px solid',
          borderColor: 'info.main',
        };
      case 'agent':
        return {
          bgcolor: 'background.paper',
          borderLeft: '4px solid',
          borderColor: 'primary.main',
        };
      case 'user':
        return {
          bgcolor: 'primary.dark',
          ml: 'auto',
          maxWidth: '70%',
        };
      default:
        return {};
    }
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex', 
      flexDirection: 'column',
      pt: 10, 
      px: 3,  
      pb: 3   
    }}>
      {/* Header */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ mb: 3 }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 2,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4">Communication Console</Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {agents.map(agent => (
              <Paper
                key={agent.id}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  SoundEffects.click();
                  setSelectedAgent(agent);
                }}
                sx={{
                  p: 1,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  bgcolor: selectedAgent.id === agent.id ? 'primary.dark' : 'background.paper',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    bgcolor: selectedAgent.id === agent.id ? 'primary.dark' : 'action.hover'
                  }
                }}
              >
                <StatusIndicator status={agent.status === 'online' ? 'online' : agent.status === 'busy' ? 'standby' : 'offline'} />
                <Typography variant="body2" sx={{ color: selectedAgent.id === agent.id ? 'common.white' : 'text.primary' }}>
                  {agent.name}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Mission Context */}
        {currentMission && (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'background.paper',
              borderLeft: '4px solid',
              borderColor: 'primary.main',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" color="primary">
                Current Mission: {currentMission.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={() => updateMission(currentMission.id, { status: 'active' })}
                  color={currentMission.status === 'active' ? 'primary' : 'default'}
                >
                  <PlayArrowIcon />
                </IconButton>
                <IconButton 
                  size="small"
                  onClick={() => updateMission(currentMission.id, { status: 'paused' })}
                  color={currentMission.status === 'paused' ? 'primary' : 'default'}
                >
                  <PauseIcon />
                </IconButton>
                <IconButton 
                  size="small"
                  onClick={() => updateMission(currentMission.id, { status: 'stopped' })}
                  color={currentMission.status === 'stopped' ? 'primary' : 'default'}
                >
                  <StopIcon />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {currentMission.objective}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {Object.entries(currentMission.parameters).map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        )}
      </Box>

      {/* Messages Container */}
      <Paper
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          overflow: 'auto',
          bgcolor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="list"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              role="listitem"
            >
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 1,
                  maxWidth: message.type === 'user' ? '70%' : '100%',
                  ...getMessageStyle(message.type),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {message.type === 'agent' && (
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                      {message.sender[0]}
                    </Avatar>
                  )}
                  <Typography variant="subtitle2" color="text.secondary">
                    {message.sender}
                  </Typography>
                  {message.type === 'system' && (
                    <Chip
                      label="SYSTEM"
                      size="small"
                      color="info"
                      sx={{ height: 20 }}
                    />
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {message.timestamp}
                  </Typography>
                </Box>
                <Typography variant="body1">{message.content}</Typography>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
            <AutorenewIcon
              component={motion.svg}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <Typography variant="caption" color="text.secondary">
              {selectedAgent.name} is typing...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input Area */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          display: 'flex',
          gap: 2,
        }}
      >
        <Button
          data-testid="commands-button"
          variant="outlined"
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ minWidth: 100 }}
        >
          Commands
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {commands.map((command) => (
            <MenuItem 
              key={command.label}
              onClick={() => handleCommandClick(command)}
            >
              {command.label}
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {command.template}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
        <TextField
          fullWidth
          variant="outlined"
          data-testid="message-input"
          placeholder="Type your message or use commands (e.g., /research, /generate)..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
            }
          }}
        />
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            data-testid="send-button"
          >
            <SendIcon />
          </IconButton>
        </motion.div>
      </Paper>
    </Box>
  );
}

export default Chat;

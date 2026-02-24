import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Clock, TrendingUp, FileText, MessageSquare, UserPlus, Award } from 'lucide-react';

interface Activity {
  id: string;
  type: 'report' | 'message' | 'player_added' | 'achievement' | 'performance';
  title: string;
  description: string;
  time: string;
  user?: string;
  metadata?: {
    rating?: number;
    playerName?: string;
    badge?: string;
  };
}

interface ActivityFeedProps {
  activities: Activity[];
  maxHeight?: string;
  showAll?: boolean;
}

export function ActivityFeed({ activities, maxHeight = '500px', showAll = false }: ActivityFeedProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'report':
        return FileText;
      case 'message':
        return MessageSquare;
      case 'player_added':
        return UserPlus;
      case 'achievement':
        return Award;
      case 'performance':
        return TrendingUp;
      default:
        return Clock;
    }
  };

  const getColor = (type: Activity['type']) => {
    switch (type) {
      case 'report':
        return 'from-primary to-primary/50';
      case 'message':
        return 'from-accent to-accent/50';
      case 'player_added':
        return 'from-chart-3 to-chart-3/50';
      case 'achievement':
        return 'from-chart-5 to-chart-5/50';
      case 'performance':
        return 'from-chart-2 to-chart-2/50';
      default:
        return 'from-muted to-muted/50';
    }
  };

  const displayActivities = showAll ? activities : activities.slice(0, 10);

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Atividade Recente</h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {activities.length} eventos
          </Badge>
        </div>
      </div>

      <ScrollArea style={{ maxHeight }}>
        <div className="p-4 space-y-3">
          {displayActivities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            const colorClass = getColor(activity.type);

            return (
              <div
                key={activity.id}
                className="flex gap-4 p-4 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-background" />
                  </div>
                  {index < displayActivities.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2 min-h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{activity.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {activity.user && (
                      <Badge variant="outline" className="text-xs">
                        {activity.user}
                      </Badge>
                    )}
                    {activity.metadata?.playerName && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        {activity.metadata.playerName}
                      </Badge>
                    )}
                    {activity.metadata?.rating && (
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
                        ⭐ {activity.metadata.rating}
                      </Badge>
                    )}
                    {activity.metadata?.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.metadata.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}

import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  chatUser: Map<string, string> = new Map();

  @SubscribeMessage('messageToUser')
  handleMessage(client: Socket, payload: any): void {
    this.server
      .to(this.chatUser[payload.to_user])
      .emit('messageReceive', payload);
  }
  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: string): void {
    this.chatUser[payload] = client.id;
    this.logger.log(`Subscription done: ${payload}`);
  }
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.chatUser.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}

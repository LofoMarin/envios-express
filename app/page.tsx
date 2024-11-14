'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CreditCard, User } from 'lucide-react'

export default function EnviosExpress() {
  const [pedido, setPedido] = useState({
    origen: '',
    destino: '',
    peso: '',
    tipoEnvio: 'normal'
  })
  const [costo, setCosto] = useState(0)
  const [descuento, setDescuento] = useState(0)
  const [trackingId, setTrackingId] = useState('')

  const calcularCosto = () => {
    const costoBase = parseFloat(pedido.peso) * 10
    const costoExpress = pedido.tipoEnvio === 'express' ? costoBase * 0.5 : 0
    const costoTotal = costoBase + costoExpress
    const descuentoAplicado = costoTotal * (descuento / 100)
    setCosto(costoTotal - descuentoAplicado)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calcularCosto()
    setTrackingId(Math.random().toString(36).substr(2, 9).toUpperCase())
  }

  const simularDescuentoPersonalizado = () => {
    setDescuento(Math.floor(Math.random() * 20))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Envíos Express</h1>
      
      <Tabs defaultValue="nuevo-pedido" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nuevo-pedido">Nuevo Pedido</TabsTrigger>
          <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
          <TabsTrigger value="cuenta">Mi Cuenta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nuevo-pedido">
          <Card>
            <CardHeader>
              <CardTitle>Realizar Nuevo Pedido</CardTitle>
              <CardDescription>Ingrese los detalles de su envío</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origen">Origen</Label>
                    <Input id="origen" placeholder="Ciudad de origen" 
                           value={pedido.origen} 
                           onChange={(e) => setPedido({...pedido, origen: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destino">Destino</Label>
                    <Input id="destino" placeholder="Ciudad de destino" 
                           value={pedido.destino} 
                           onChange={(e) => setPedido({...pedido, destino: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input id="peso" type="number" placeholder="Peso del paquete" 
                           value={pedido.peso} 
                           onChange={(e) => setPedido({...pedido, peso: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo-envio">Tipo de Envío</Label>
                    <Select onValueChange={(value) => setPedido({...pedido, tipoEnvio: value})}>
                      <SelectTrigger id="tipo-envio">
                        <SelectValue placeholder="Seleccione tipo de envío" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full">Calcular Costo y Realizar Pedido</Button>
              </form>
            </CardContent>
            <CardFooter>
              {costo > 0 && (
                <div className="w-full text-center">
                  <p className="text-lg">Costo Total: ${costo.toFixed(2)}</p>
                  {descuento > 0 && (
                    <Badge variant="secondary">Descuento aplicado: {descuento}%</Badge>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguimiento">
          <Card>
            <CardHeader>
              <CardTitle>Seguimiento de Pedido</CardTitle>
              <CardDescription>Ingrese su número de seguimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Número de seguimiento" value={trackingId} readOnly />
                {trackingId && (
                  <div className="flex items-center space-x-2">
                    <Truck className="text-green-500" />
                    <span>Su pedido está en camino</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cuenta">
          <Card>
            <CardHeader>
              <CardTitle>Mi Cuenta</CardTitle>
              <CardDescription>Gestione sus descuentos y pagos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={simularDescuentoPersonalizado} className="w-full">
                  <User className="mr-2 h-4 w-4" /> Obtener Descuento Personalizado
                </Button>
                <div className="flex items-center justify-between">
                  <span>Método de Pago:</span>
                  <Badge variant="outline"><CreditCard className="mr-2 h-4 w-4" /> Visa ****1234</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
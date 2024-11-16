'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CreditCard, User, Send, LogIn, UserPlus, Percent, Wallet, ClipboardList } from 'lucide-react'

const PedidoCard = ({ pedido }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="border-gray-600 bg-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-200">Pedido #{pedido.trackingId}</CardTitle>
        <Badge variant="outline" className="text-gray-300 border-gray-500">
          {pedido.estado}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-gray-400 mb-2">Fecha: {pedido.fecha}</div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-200">
            {pedido.origen} → {pedido.destino}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 border-gray-500"
          >
            {isOpen ? 'Ocultar' : 'Detalle'}
          </Button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-2 overflow-hidden"
            >
              <div className="text-sm text-gray-300">
                <div>Tipo de envío: {pedido.tipoEnvio}</div>
                <div>Peso: {pedido.peso} kg</div>
                <div>Costo: ${pedido.costo.toFixed(2)}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-200">Línea de tiempo:</div>
                {pedido.timeline.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <div className="text-xs text-gray-300">{item.estado} - {item.fecha}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

const DescuentoCard = ({ descuento, onReclamar }) => (
  <Card className="border-gray-600 bg-gray-700">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-200">{descuento.nombre}</CardTitle>
      <Badge variant="outline" className={descuento.reclamado ? "text-gray-400 border-gray-500" : "text-green-400 border-green-500"}>
        {descuento.reclamado ? "Reclamado" : "Disponible"}
      </Badge>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-300">{descuento.descripcion}</p>
      {!descuento.reclamado && (
        <Button onClick={() => onReclamar(descuento.id)} className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white">
          Reclamar
        </Button>
      )}
    </CardContent>
  </Card>
)

export function EnviosExpressComponent() {
  const [pedido, setPedido] = useState({
    origen: '',
    destino: '',
    peso: '',
    tipoEnvio: 'normal'
  })
  const [costo, setCosto] = useState(0)
  const [descuento, setDescuento] = useState(0)
  const [trackingId, setTrackingId] = useState('')
  const [pedidoRealizado, setPedidoRealizado] = useState(false)
  const [activeTab, setActiveTab] = useState('nuevo-pedido')
  const [costoCalculado, setCostoCalculado] = useState(false)
  const [pedidos, setPedidos] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeAccountTab, setActiveAccountTab] = useState('login')
  const [descuentos, setDescuentos] = useState([
    { id: 1, nombre: "Descuento de bienvenida", descripcion: "10% en tu primer envío", reclamado: false },
    { id: 2, nombre: "Descuento de verano", descripcion: "15% en envíos internacionales", reclamado: false },
    { id: 3, nombre: "Descuento de fidelidad", descripcion: "5% en todos los envíos", reclamado: true },
  ])
  const [metodosPago, setMetodosPago] = useState([
    { id: 1, tipo: "Tarjeta de crédito", numero: "**** **** **** 1234" },
    { id: 2, tipo: "Efectivo", numero: "N/A" },
  ])

  useEffect(() => {
    const tabsList = document.querySelector('[role="tablist"]');
    if (tabsList) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
            const activeTabElement = tabsList.querySelector('[data-state="active"]');
            if (activeTabElement) {
              setActiveTab(activeTabElement.getAttribute('data-value') || 'nuevo-pedido');
            }
          }
        });
      });
      observer.observe(tabsList, { attributes: true, subtree: true });
      return () => observer.disconnect();
    }
  }, []);

  const calcularCosto = () => {
    const costoBase = parseFloat(pedido.peso) * 10
    const costoExpress = pedido.tipoEnvio === 'express' ? costoBase * 0.5 : 0
    const costoTotal = costoBase + costoExpress
    const descuentoAplicado = costoTotal * (descuento / 100)
    setCosto(costoTotal - descuentoAplicado)
    setCostoCalculado(true)
  }

  const realizarPedido = () => {
    if (costo > 0) {
      const nuevoPedido = {
        id: Math.random().toString(36).substr(2, 9),
        trackingId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        origen: pedido.origen,
        destino: pedido.destino,
        peso: pedido.peso,
        tipoEnvio: pedido.tipoEnvio,
        costo: costo,
        estado: 'En proceso',
        fecha: new Date().toLocaleDateString(),
        timeline: [
          { estado: 'Pedido realizado', fecha: new Date().toLocaleDateString() },
          { estado: 'En preparación', fecha: new Date(Date.now() + 86400000).toLocaleDateString() },
          { estado: 'En tránsito', fecha: new Date(Date.now() + 172800000).toLocaleDateString() },
          { estado: 'Entregado', fecha: new Date(Date.now() + 259200000).toLocaleDateString() },
        ]
      }
      setPedidos([nuevoPedido, ...pedidos])
      setTrackingId(nuevoPedido.trackingId)
      setPedidoRealizado(true)
      setCostoCalculado(false)
      setPedido({
        origen: '',
        destino: '',
        peso: '',
        tipoEnvio: 'normal'
      })
      setCosto(0)
    }
  }

  const simularDescuentoPersonalizado = () => {
    setDescuento(Math.floor(Math.random() * 20))
  }

  const reiniciarFormulario = () => {
    setPedidoRealizado(false)
    setTrackingId('')
  }

  const reclamarDescuento = (id) => {
    setDescuentos(descuentos.map(d => 
      d.id === id ? {...d, reclamado: true} : d
    ))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center text-red-500 flex items-center justify-center"
      >
        <Send className="w-8 h-8 mr-2 text-red-500" />
        EnviosYa
      </motion.h1>

      <Tabs defaultValue="nuevo-pedido" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="nuevo-pedido" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Nuevo Pedido</TabsTrigger>
          <TabsTrigger value="seguimiento" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Seguimiento</TabsTrigger>
          <TabsTrigger value="cuenta" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Mi Cuenta</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="nuevo-pedido">
              <Card className="border-gray-700 shadow-md bg-gray-800">
                <CardHeader className="bg-gray-700">
                  <CardTitle className="text-red-500">Realizar Nuevo Pedido</CardTitle>
                  <CardDescription className="text-gray-300">Ingrese los detalles de su envío</CardDescription>
                </CardHeader>
                <CardContent>
                  {!pedidoRealizado ? (
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="origen" className="text-gray-300">Origen</Label>
                          <Input id="origen" placeholder="Ciudad de origen"
                                 value={pedido.origen}
                                 onChange={(e) => setPedido({...pedido, origen: e.target.value})}
                                 className="bg-gray-700 text-white border-gray-600" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destino" className="text-gray-300">Destino</Label>
                          <Input id="destino" placeholder="Ciudad de destino"
                                 value={pedido.destino}
                                 onChange={(e) => setPedido({...pedido, destino: e.target.value})}
                                 className="bg-gray-700 text-white border-gray-600" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="peso" className="text-gray-300">Peso (kg)</Label>
                          <Input id="peso" type="number" placeholder="Peso del paquete"
                                 value={pedido.peso}
                                 onChange={(e) => setPedido({...pedido, peso: e.target.value})}
                                 className="bg-gray-700 text-white border-gray-600" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tipo-envio" className="text-gray-300">Tipo de Envío</Label>
                          <Select onValueChange={(value) => setPedido({...pedido, tipoEnvio: value})}>
                            <SelectTrigger id="tipo-envio" className="bg-gray-700 text-white border-gray-600">
                              <SelectValue placeholder="Seleccione tipo de envío" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 text-white border-gray-600">
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="express">Express</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <Button type="button" onClick={calcularCosto} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                          Calcular Costo
                        </Button>
                        <motion.div className="flex-1" whileHover={{ scale: costoCalculado ? 1.05 : 1 }} whileTap={{ scale: costoCalculado ? 0.95 : 1 }}>
                          <Button 
                            type="button" 
                            onClick={realizarPedido} 
                            className="w-full bg-red-600 hover:bg-red-700 text-white" 
                            disabled={!costoCalculado}
                          >
                            Realizar Pedido
                          </Button>
                        </motion.div>
                      </div>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <p className="text-green-400 text-xl">¡Pedido realizado con éxito!</p>
                      <p className="text-white">Número de seguimiento: {trackingId}</p>
                      <Button onClick={reiniciarFormulario} className="bg-red-600 hover:bg-red-700 text-white">
                        Realizar nuevo envío
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
                <CardFooter>
                  {!pedidoRealizado && costo > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-full text-center"
                    >
                      <p className="text-lg text-white">Costo Total: ${costo.toFixed(2)}</p>
                      {descuento > 0 && (
                        <Badge variant="secondary" className="bg-red-500 text-white">Descuento aplicado: {descuento}%</Badge>
                      )}
                    </motion.div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="seguimiento">
              <Card className="border-gray-700 shadow-md bg-gray-800">
                <CardHeader className="bg-gray-700">
                  <CardTitle className="text-red-500">Seguimiento de Pedidos</CardTitle>
                  <CardDescription className="text-gray-300">Historial de sus envíos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pedidos.length === 0 ? (
                      <p className="text-gray-300 text-center">No hay pedidos realizados aún.</p>
                    ) : (
                      pedidos.map((pedido) => (
                        <PedidoCard key={pedido.id} pedido={pedido} />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cuenta">
              <Card className="border-gray-700 shadow-md bg-gray-800">
                <CardHeader className="bg-gray-700">
                  <CardTitle className="text-red-500">Mi Cuenta</CardTitle>
                  <CardDescription className="text-gray-300">Gestione su cuenta, descuentos y pagos</CardDescription>
                </CardHeader>
                <CardContent>
                  {!isLoggedIn ? (
                    <Tabs value={activeAccountTab} onValueChange={setActiveAccountTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                        <TabsTrigger value="login" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">
                          <LogIn className="w-4 h-4 mr-2" />
                          Iniciar Sesión
                        </TabsTrigger>
                        <TabsTrigger value="register" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Registrarse
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Correo Electrónico</Label>
                            <Input id="email" type="email" placeholder="correo@ejemplo.com" required className="bg-gray-700 text-white border-gray-600" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                            <Input id="password" type="password" placeholder="********" required className="bg-gray-700 text-white border-gray-600" />
                          </div>
                          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Iniciar Sesión</Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="register-name" className="text-gray-300">Nombre Completo</Label>
                            <Input id="register-name" placeholder="Juan Pérez" required className="bg-gray-700 text-white border-gray-600" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="register-email" className="text-gray-300">Correo Electrónico</Label>
                            <Input id="register-email" type="email" placeholder="correo@ejemplo.com" required className="bg-gray-700 text-white border-gray-600" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="register-password" className="text-gray-300">Contraseña</Label>
                            <Input id="register-password" type="password" placeholder="********" required className="bg-gray-700 text-white border-gray-600" />
                          </div>
                          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Registrarse</Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2 flex items-center">
                          <Percent className="w-5 h-5 mr-2" />
                          Descuentos Disponibles
                        </h3>
                        <div className="space-y-2">
                          {descuentos.map(descuento => (
                            <DescuentoCard key={descuento.id} descuento={descuento} onReclamar={reclamarDescuento} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2 flex items-center">
                          <Wallet className="w-5 h-5 mr-2" />
                          Métodos de Pago
                        </h3>
                        <div className="space-y-2">
                          {metodosPago.map(metodo => (
                            <Card key={metodo.id} className="border-gray-600 bg-gray-700">
                              <CardContent className="flex justify-between items-center p-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-200">{metodo.tipo}</p>
                                  <p className="text-xs text-gray-400">{metodo.numero}</p>
                                </div>
                                <Button variant="outline" size="sm" className="text-gray-300 border-gray-500">
                                  Editar
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Agregar Método de Pago
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2 flex items-center">
                          <ClipboardList className="w-5 h-5 mr-2" />
                          Historial de Pedidos
                        </h3>
                        <div className="space-y-2">
                          {pedidos.slice(0, 3).map((pedido) => (
                            <PedidoCard key={pedido.id} pedido={pedido} />
                          ))}
                          {pedidos.length > 3 && (
                            <Button variant="outline" className="w-full text-gray-300 border-gray-500">
                              Ver todos los pedidos
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}